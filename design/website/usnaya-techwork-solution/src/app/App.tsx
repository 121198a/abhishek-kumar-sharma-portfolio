import { lazy, Suspense, useEffect } from "react";
import { DialoguePanel } from "../components/DialoguePanel";
import { ErrorBoundary, hasWebGL } from "../components/ErrorBoundary";
import {
  ActionBar,
  DirectoryPanel,
  HelpPanel,
  Minimap,
  PauseOverlay,
  SettingsPanel,
  TeamPanel,
  Toast,
  TopBar,
  Toolbar,
  TouchDpad,
  TourBanner,
} from "../components/Hud";
import { ExitScreen, FailedScreen, LoadingScreen, WelcomeScreen } from "../components/Screens";
import { audio } from "../engine/AudioManager";
import { useInput } from "../engine/useInput";
import { DIALOGUE_STATES, useExperience } from "../store/experienceStore";
import { useDialogue } from "../store/dialogueStore";
import { useUi } from "../store/uiStore";
import { TOUR_STOPS } from "../data/destinations";
import { send } from "../experience/ExperienceDirector";
import { useTour } from "../store/tourStore";

const Scene = lazy(() => import("../engine/Scene"));
const DebugPanel = import.meta.env.DEV ? lazy(() => import("../components/DebugPanel")) : null;

/** Keeps the dialogue store and audio cues in step with the Director. One-way: Director -> UI. */
function useDirectorSync() {
  const name = useExperience((s) => s.name);
  const sub = useExperience((s) => s.sub);
  const conversationId = useExperience((s) => s.context.conversationId);
  useEffect(() => {
    const inDialogue = (DIALOGUE_STATES as readonly string[]).includes(name);
    if (inDialogue && conversationId) useDialogue.getState().open(conversationId);
    else useDialogue.getState().close();
  }, [name, conversationId]);
  useEffect(() => {
    if (name === "destinationChoice") useUi.getState().open("directory");
  }, [name]);
  useEffect(() => {
    if (name === "managerDoor" && sub === "knocking") audio.play("knock");
    if (name === "managerDoor" && sub === "opening") audio.play("door");
  }, [name, sub]);
}

/** Runs the guided tour: after each stop's conversation closes, walk to the next stop. Any manual choice cancels it. */
function useTourDirector() {
  const { active, index } = useTour();
  const name = useExperience((s) => s.name);
  const dest = useExperience((s) => s.context.destinationId);
  const mode = useExperience((s) => s.context.mode);
  useEffect(() => {
    if (!active) return;
    const { stop, setIndex } = useTour.getState();
    if (mode === "free" || name === "exit") return stop();
    if (name === "guidedTravel" && dest !== TOUR_STOPS[index]) return stop();
    if (name === "destinationChoice" && dest === TOUR_STOPS[index]) {
      const next = TOUR_STOPS[index + 1];
      if (!next) return stop();
      setIndex(index + 1);
      send({ type: "destination:selected", destinationId: next });
    }
  }, [active, index, name, dest, mode]);
}

export default function App() {
  useInput();
  useDirectorSync();
  useTourDirector();
  const webgl = hasWebGL();
  if (!webgl) {
    return (
      <main className="fullscreen-note" role="alert">
        <h1>3D isn't available in this browser</h1>
        <p>
          The virtual office needs WebGL. Try the latest Chrome, Edge, Firefox or Safari, make sure hardware acceleration is on, then reload.
        </p>
      </main>
    );
  }
  return (
    <main className="app">
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </ErrorBoundary>
      <LoadingScreen />
      <FailedScreen />
      <WelcomeScreen />
      <TopBar />
      <Toolbar />
      <DirectoryPanel />
      <TeamPanel />
      <HelpPanel />
      <SettingsPanel />
      <Minimap />
      <TouchDpad />
      <Toast />
      <TourBanner />
      <ActionBar />
      <DialoguePanel />
      <PauseOverlay />
      <ExitScreen />
      {DebugPanel && (
        <Suspense fallback={null}>
          <DebugPanel />
        </Suspense>
      )}
    </main>
  );
}
