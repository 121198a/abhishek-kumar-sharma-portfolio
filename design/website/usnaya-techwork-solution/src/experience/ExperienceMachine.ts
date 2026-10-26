import { assign, setup } from "xstate";
import { characterById } from "../data/characters";
import { destinationById, isValidDestination } from "../data/destinations";
import type { ExperienceEvent, Mode } from "./ExperienceEvents";
import { MANAGER_DOOR_TARGET } from "./ExperienceEvents";

export type ExperienceContext = {
  mode: Mode;
  destinationId: string | null;
  /** Incremented on every new route. Arrival events carrying an old id are ignored. */
  routeId: number;
  /** Incremented when the visitor skips; the runtime snaps the current route to its end. */
  skipCount: number;
  conversationId: string | null;
  speakerId: string | null;
  paused: boolean;
  error: string | null;
};

export const initialContext: ExperienceContext = {
  mode: "guided",
  destinationId: null,
  routeId: 0,
  skipCount: 0,
  conversationId: null,
  speakerId: null,
  paused: false,
  error: null,
};

export const KNOCK_DELAY = 900;
export const PERMISSION_DELAY = 1400;
export const OPENING_DELAY = 1300;

/** Any known destination is valid outside of travel (picking the current one just re-arrives). */
const isValidDest = ({ event }: { context: ExperienceContext; event: ExperienceEvent }) =>
  event.type === "destination:selected" && isValidDestination(event.destinationId);

/** While travelling, only a *different* destination re-routes; repeats are ignored. */
const isRetarget = ({ context, event }: { context: ExperienceContext; event: ExperienceEvent }) =>
  event.type === "destination:selected" && isValidDestination(event.destinationId) && event.destinationId !== context.destinationId;

const matchesRoute = ({ context, event }: { context: ExperienceContext; event: ExperienceEvent }) =>
  event.type === "navigation:arrived" && event.routeId === context.routeId;

export const experienceMachine = setup({
  types: { context: {} as ExperienceContext, events: {} as ExperienceEvent },
  guards: {
    isValidDest,
    isRetarget,
    matchesRoute,
    isFreeMode: ({ context }) => context.mode === "free",
    toManagerDoor: ({ context }) => context.destinationId === "manager-cabin",
    hasIntro: ({ context }) => Boolean(destinationById(context.destinationId ?? "")?.introConversationId),
    isDoorTarget: ({ event }) => event.type === "interaction:started" && event.targetId === MANAGER_DOOR_TARGET,
    isCharacterWithTalk: ({ event }) =>
      event.type === "interaction:started" && Boolean(characterById(event.targetId)?.conversationId),
  },
  actions: {
    travelTo: assign(({ context, event }) => ({
      destinationId: event.type === "destination:selected" ? event.destinationId : null,
      routeId: context.routeId + 1,
    })),
    startConversation: assign(({ event, context }) => {
      if (event.type === "interaction:started") {
        const ch = characterById(event.targetId);
        return { conversationId: ch?.conversationId ?? null, speakerId: ch?.id ?? null };
      }
      return { conversationId: context.conversationId, speakerId: context.speakerId };
    }),
    setFree: assign({ mode: "free" as Mode }),
    setGuided: assign({ mode: "guided" as Mode }),
    invalidateRoute: assign(({ context }) => ({ routeId: context.routeId + 1 })),
    registerSkip: assign(({ context }) => ({ skipCount: context.skipCount + 1 })),
    pause: assign({ paused: true }),
    resume: assign({ paused: false }),
    setError: assign(({ event }) => ({
      error: event.type === "asset:failed" || event.type === "conversation:failed" ? event.reason : "Unknown error",
    })),
    clearError: assign({ error: null }),
    introFromDestination: assign(({ context }) => {
      const d = destinationById(context.destinationId ?? "");
      return { conversationId: d?.introConversationId ?? null, speakerId: d?.speakerId ?? null };
    }),
    managerConversation: assign({ conversationId: "manager-intro", speakerId: "umesh" }),
    clearConversation: assign({ conversationId: null, speakerId: null }),
    resetContext: assign(() => ({
      mode: "guided" as Mode,
      destinationId: null,
      routeId: 0,
      skipCount: 0,
      conversationId: null,
      speakerId: null,
      paused: false,
      error: null,
    })),
    startArrival: assign(({ context }) => ({ destinationId: "reception", routeId: context.routeId + 1 })),
  },
}).createMachine({
  id: "experience",
  initial: "loading",
  context: initialContext,
  on: {
    "experience:paused": { actions: "pause" },
    "experience:resumed": { actions: "resume" },
    "conversation:failed": { actions: "setError" },
    "asset:failed": { target: ".failed", actions: "setError" },
    "experience:restart": { target: ".welcome", actions: ["clearError", "clearConversation", "resetContext"] },
  },
  states: {
    loading: {
      on: {
        "assets:ready": "welcome",
        "asset:failed": { target: "failed", actions: "setError" },
      },
    },
    failed: {
      on: { "experience:restart": { target: "loading", actions: ["clearError", "clearConversation", "resetContext"] } },
    },
    welcome: {
      on: {
        "experience:start": { target: "arrival", actions: "startArrival" },
        "skip:requested": { target: "reception", actions: ["startArrival", "registerSkip"] },
      },
    },
    arrival: {
      on: {
        "navigation:arrived": { guard: "matchesRoute", target: "reception" },
        "skip:requested": { actions: "registerSkip" },
      },
    },
    reception: {
      entry: assign({ conversationId: "reception-intro", speakerId: "receptionist", destinationId: "reception" }),
      on: {
        "destination:selected": { guard: "isValidDest", target: "guidedTravel", actions: ["clearConversation", "travelTo"] },
        "dialogue:completed": [
          { guard: "isFreeMode", target: "freeExplore", actions: "clearConversation" },
          { target: "destinationChoice", actions: "clearConversation" },
        ],
        "mode:changed": [
          { guard: ({ event }) => event.mode === "free", target: "freeExplore", actions: ["setFree", "clearConversation"] },
          { actions: "setGuided" },
        ],
        "skip:requested": { target: "destinationChoice", actions: "clearConversation" },
      },
    },
    destinationChoice: {
      on: {
        "destination:selected": { guard: "isValidDest", target: "guidedTravel", actions: "travelTo" },
        "interaction:started": [
          { guard: "isDoorTarget", target: "managerDoor" },
          { guard: "isCharacterWithTalk", target: "dialogue", actions: "startConversation" },
        ],
        "mode:changed": { guard: ({ event }) => event.mode === "free", target: "freeExplore", actions: "setFree" },
        "experience:exit": "exit",
      },
    },
    guidedTravel: {
      on: {
        // a different destination re-enters this state: new routeId cancels the old route
        "destination:selected": { guard: "isRetarget", target: "guidedTravel", reenter: true, actions: "travelTo" },
        "navigation:arrived": { guard: "matchesRoute", target: "destinationArrival" },
        "skip:requested": { actions: "registerSkip" },
        "mode:changed": { guard: ({ event }) => event.mode === "free", target: "freeExplore", actions: ["setFree", "invalidateRoute"] },
      },
    },
    destinationArrival: {
      always: [
        { guard: "toManagerDoor", target: "managerDoor" },
        { guard: "hasIntro", target: "dialogue", actions: "introFromDestination" },
        { guard: "isFreeMode", target: "freeExplore" },
        { target: "destinationChoice" },
      ],
    },
    freeExplore: {
      on: {
        "destination:selected": { guard: "isValidDest", target: "guidedTravel", actions: "travelTo" },
        "interaction:started": [
          { guard: "isDoorTarget", target: "managerDoor" },
          { guard: "isCharacterWithTalk", target: "dialogue", actions: "startConversation" },
        ],
        "mode:changed": { guard: ({ event }) => event.mode === "guided", target: "destinationChoice", actions: "setGuided" },
        "experience:exit": "exit",
      },
    },
    dialogue: {
      on: {
        "dialogue:completed": [
          { guard: "isFreeMode", target: "freeExplore", actions: "clearConversation" },
          { target: "destinationChoice", actions: "clearConversation" },
        ],
        "destination:selected": { guard: "isValidDest", target: "guidedTravel", actions: ["clearConversation", "travelTo"] },
        "mode:changed": [
          { guard: ({ event }) => event.mode === "free", target: "freeExplore", actions: ["setFree", "clearConversation"] },
          { actions: "setGuided" },
        ],
        "skip:requested": [
          { guard: "isFreeMode", target: "freeExplore", actions: "clearConversation" },
          { target: "destinationChoice", actions: "clearConversation" },
        ],
      },
    },
    managerDoor: {
      initial: "awaitingKnock",
      on: {
        "destination:selected": { guard: "isValidDest", target: "guidedTravel", actions: "travelTo" },
        "mode:changed": { guard: ({ event }) => event.mode === "free", target: "freeExplore", actions: "setFree" },
        "skip:requested": { target: "managerDialogue" },
      },
      states: {
        awaitingKnock: { on: { "door:knocked": "knocking" } },
        knocking: { after: { [KNOCK_DELAY]: "waitingPermission" } },
        waitingPermission: { after: { [PERMISSION_DELAY]: "opening" } },
        opening: {
          after: { [OPENING_DELAY]: "#experience.managerDialogue" },
          on: { "door:opened": "#experience.managerDialogue" },
        },
      },
    },
    managerDialogue: {
      entry: "managerConversation",
      on: {
        "dialogue:completed": [
          { guard: "isFreeMode", target: "freeExplore", actions: "clearConversation" },
          { target: "destinationChoice", actions: "clearConversation" },
        ],
        "skip:requested": [
          { guard: "isFreeMode", target: "freeExplore", actions: "clearConversation" },
          { target: "destinationChoice", actions: "clearConversation" },
        ],
        "destination:selected": { guard: "isValidDest", target: "guidedTravel", actions: ["clearConversation", "travelTo"] },
      },
    },
    exit: {
      on: {
        "destination:selected": { guard: "isValidDest", target: "guidedTravel", actions: ["clearConversation", "travelTo"] },
        "experience:restart": { target: "welcome", actions: ["clearError", "clearConversation", "resetContext"] },
      },
    },
  },
});
