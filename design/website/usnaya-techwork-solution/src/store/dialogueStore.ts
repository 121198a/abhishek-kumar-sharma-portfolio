import { create } from "zustand";
import { advance, applyChoice, getConversation, startNode } from "../dialogue/DialogueManager";
import type { DialogueChoice, DialogueNode } from "../data/types";
import { send } from "../experience/ExperienceDirector";
import { isValidDestination } from "../data/destinations";
import { audio } from "../engine/AudioManager";
import { voice } from "../engine/VoiceManager";
import { world } from "../engine/worldRef";

export type ChatMessage = {
  id: string;
  sender: "employee" | "visitor";
  text: string;
  timestamp: string;
  error?: boolean;
};

export type AiReply = {
  status: "idle" | "loading" | "done" | "error";
  text?: string;
  suggestedReplies?: string[];
  action?: { type: "navigate"; targetId: string } | null;
  source?: "ai" | "fallback";
};

type DialogueStore = {
  conversationId: string | null;
  node: DialogueNode | null;
  messages: ChatMessage[];
  ai: AiReply;
  open: (conversationId: string) => void;
  close: () => void;
  choose: (choice: DialogueChoice) => void;
  next: () => void;
  setAi: (a: AiReply) => void;
  addMessage: (m: ChatMessage) => void;
};

/** Plain-text line for the character's speech bubble. */
export function currentLine(): string | null {
  const { messages, node } = useDialogue.getState();
  const last = messages.filter((m) => m.sender === "employee").pop();
  if (last) return last.text.length > 90 ? `${last.text.slice(0, 87)}…` : last.text;
  if (!node) return null;
  return node.text.length > 90 ? `${node.text.slice(0, 87)}…` : node.text;
}

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const useDialogue = create<DialogueStore>((set, get) => ({
  conversationId: null,
  node: null,
  messages: [],
  ai: { status: "idle" },
  open: (conversationId) => {
    if (get().conversationId === conversationId) return; // one conversation at a time, no duplicates
    const c = getConversation(conversationId);
    if (!c) {
      set({ conversationId: null, node: null, messages: [], ai: { status: "idle" } });
      send({ type: "conversation:failed", reason: `Missing conversation ${conversationId}` });
      return;
    }
    const n = startNode(c);
    voice.stop();
    voice.speak(n.text, n.speakerId);
    set({
      conversationId,
      node: n,
      messages: [{ id: `msg-${Date.now()}`, sender: "employee", text: n.text, timestamp: getTime() }],
      ai: { status: "idle" },
    });
  },
  close: () => {
    voice.stop();
    set({ conversationId: null, node: null, messages: [], ai: { status: "idle" } });
  },
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  choose: (choice) => {
    const { conversationId, node } = get();
    const c = getConversation(conversationId);
    if (!c || !node || !node.choices?.some((x) => x.id === choice.id)) return;

    // Append user's choice to conversation transcript
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "visitor",
      text: choice.label,
      timestamp: getTime(),
    };
    get().addMessage(userMsg);

    const r = applyChoice(c, choice);
    if (r.kind === "node") {
      const empMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        sender: "employee",
        text: r.node.text,
        timestamp: getTime(),
      };
      get().addMessage(empMsg);
      voice.speak(r.node.text, r.node.speakerId);
      return set({ node: r.node, ai: { status: "idle" } });
    }
    if (r.kind === "end") {
      voice.stop();
      return send({ type: "dialogue:completed" });
    }
    const a = r.choice.action;
    if (!a) return;
    voice.stop();
    if (a.type === "navigate") {
      if (isValidDestination(a.targetId)) send({ type: "destination:selected", destinationId: a.targetId });
    } else if (a.type === "freeExplore") {
      send({ type: "mode:changed", mode: "free" });
      send({ type: "dialogue:completed" });
    } else if (a.type === "toggleGate") {
      world.sim.toggleGate();
      audio.play("door");
    } else if (a.type === "startTour") {
      send({ type: "mode:changed", mode: "guided" });
    } else {
      send({ type: "dialogue:completed" });
    }
  },
  next: () => {
    const { conversationId, node } = get();
    const c = getConversation(conversationId);
    if (!c || !node) return;
    const r = advance(c, node);
    if (r.kind === "node") {
      const empMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        sender: "employee",
        text: r.node.text,
        timestamp: getTime(),
      };
      get().addMessage(empMsg);
      voice.speak(r.node.text, r.node.speakerId);
      set({ node: r.node, ai: { status: "idle" } });
    } else {
      voice.stop();
      send({ type: "dialogue:completed" });
    }
  },
  setAi: (ai) => set({ ai }),
}));
