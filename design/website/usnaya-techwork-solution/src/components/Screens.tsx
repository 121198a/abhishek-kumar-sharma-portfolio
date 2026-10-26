import { PROJECT_NAME } from "../data/project";
import { send } from "../experience/ExperienceDirector";
import { useExperience } from "../store/experienceStore";
import { useLoading } from "../store/loadingStore";
import { audio } from "../engine/AudioManager";
import { restartExperience } from "./Hud";
import { useUi } from "../store/uiStore";
import { useTour } from "../store/tourStore";

export function LoadingScreen() {
  const name = useExperience((s) => s.name);
  const progress = useLoading((s) => s.progress);
  if (name !== "loading") return null;
  const pct = Math.round(progress * 100);
  return (
    <div className="fullscreen-note" role="status" aria-live="polite">
      <p className="eyebrowless">{PROJECT_NAME}</p>
      <h1>Preparing the office</h1>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="progress__bar" style={{ width: `${pct}%` }} />
      </div>
      <p className="muted">{pct}% ready</p>
    </div>
  );
}

export function FailedScreen() {
  const { name, context } = useExperience();
  if (name !== "failed") return null;
  return (
    <div className="fullscreen-note" role="alert">
      <h1>The office didn't load</h1>
      <p>
        {context.error ?? "An unknown problem stopped the scene from loading."}
      </p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
        <button className="btn btn--primary" onClick={restartExperience}>
          Try again
        </button>
        <button className="btn btn--quiet" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    </div>
  );
}

export function WelcomeScreen() {
  const name = useExperience((s) => s.name);
  const open = useUi((s) => s.open);
  const startTour = useTour((s) => s.start);
  if (name !== "welcome") return null;
  return (
    <div className="welcome">
      <div className="welcome__card">
        <span className="welcome__tag">Corporate Virtual Office • 3D Experience</span>
        <h1 className="welcome__title">{PROJECT_NAME}</h1>
        <p className="welcome__lead">
          Step inside our virtual workspace. Meet leadership and department staff, inspect facilities, or explore freely in 3D.
        </p>
        <div className="welcome__actions">
          <button
            className="btn btn--primary btn--big"
            onClick={() => {
              audio.unlock();
              send({ type: "experience:start" });
            }}
          >
            Enter the office
          </button>
          <button
            className="btn btn--choice"
            onClick={() => {
              audio.unlock();
              send({ type: "experience:start" });
              startTour();
            }}
          >
            Start guided tour
          </button>
          <button className="btn btn--quiet" onClick={() => open("help")}>
            Controls
          </button>
        </div>
        <div className="welcome__meta">
          <span>6 Team Members</span>
          <span>•</span>
          <span>11 Locations</span>
          <span>•</span>
          <span>Interactive 3D</span>
        </div>
      </div>
    </div>
  );
}

export function ExitScreen() {
  const name = useExperience((s) => s.name);
  if (name !== "exit") return null;
  return (
    <div className="overlay" role="dialog" aria-label="Visit complete">
      <div className="card">
        <h2>Thank you for visiting</h2>
        <p>You can return to reception or start the visit again.</p>
        <div className="card__actions">
          <button className="btn btn--primary" onClick={() => send({ type: "destination:selected", destinationId: "reception" })}>
            Back to reception
          </button>
          <button className="btn btn--quiet" onClick={restartExperience}>
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
