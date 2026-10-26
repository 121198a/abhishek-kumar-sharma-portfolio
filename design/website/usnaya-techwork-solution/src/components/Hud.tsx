import { useEffect, useRef } from "react";
import { zones } from "../data/departments";
import { COMPOUND, exteriorZones, paths, roads } from "../data/exterior";
import { destinationById, TOUR_STOPS } from "../data/destinations";
import { audio } from "../engine/AudioManager";
import { interact, setTouchInput } from "../engine/useInput";
import { world } from "../engine/worldRef";
import { characterById, characters } from "../data/characters";
import { send } from "../experience/ExperienceDirector";
import { useExperience } from "../store/experienceStore";
import { useSettings } from "../store/settingsStore";
import { useUi } from "../store/uiStore";
import { useTour } from "../store/tourStore";
import { useDialogue } from "../store/dialogueStore";
import { useLoading } from "../store/loadingStore";

export function objectiveText(name: string, sub: string | null, destId: string | null, speakerId: string | null): string {
  const dest = destinationById(destId ?? "")?.label;
  switch (name) {
    case "arrival":
      return "Walking to reception";
    case "reception":
      return "Speak with the receptionist";
    case "destinationChoice":
      return "Choose where to go next";
    case "guidedTravel":
      return dest ? `Heading to ${dest}` : "Walking";
    case "freeExplore":
      return "Explore freely. Walk up to someone and press E to talk.";
    case "dialogue":
    case "managerDialogue":
      return `Talking with ${characterById(speakerId ?? "")?.displayName ?? "a colleague"}`;
    case "managerDoor":
      return sub === "knocking"
        ? "Knocking…"
        : sub === "waitingPermission"
          ? "Waiting for permission"
          : sub === "opening"
            ? "The door is opening"
            : "Knock on the manager's door";
    case "exit":
      return "Visit complete";
    default:
      return "";
  }
}

/** Experience states in which the visitor may pick a destination, start the tour or speak to someone. */
const INTERACTIVE_STATES = ["reception", "destinationChoice", "freeExplore", "dialogue", "guidedTravel", "managerDoor", "managerDialogue", "exit"];

function PanelHead({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="panel__head">
      <h2>{title}</h2>
      <button className="btn btn--quiet" onClick={onClose}>
        Close
      </button>
    </header>
  );
}

function toggleFullscreen() {
  try {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  } catch {
    /* fullscreen not available in this browser */
  }
}

export function TopBar() {
  const { name, sub, context } = useExperience();
  const tour = useTour();
  const base = objectiveText(name, sub, context.destinationId, context.speakerId);
  const stop = tour.active && tour.index >= 0 ? destinationById(TOUR_STOPS[tour.index] ?? "")?.label : null;
  const text = tour.active && stop ? `Tour, stop ${tour.index + 1} of ${TOUR_STOPS.length}: ${stop}. ${base}` : base;
  if (name === "loading" || name === "welcome" || name === "failed") return null;
  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true" />
        <span>
          <strong>USNAYA</strong> Techworks Solutions
        </span>
      </div>
      <p className="objective" aria-live="polite">
        {text}
      </p>
    </div>
  );
}

export function Toolbar() {
  const { name, context } = useExperience();
  const panel = useUi((s) => s.panel);
  const toggle = useUi((s) => s.toggle);
  const { muted, set } = useSettings();
  const orbit = useUi((s) => s.cameraMode === "orbit");
  const setCameraMode = useUi((s) => s.setCameraMode);
  if (["loading", "welcome", "failed", "arrival"].includes(name)) return null;
  const free = context.mode === "free";
  const canSwitch = !["exit", "managerDoor"].includes(name);
  return (
    <div className="toolbar" role="toolbar" aria-label="Office controls">
      <div className="segmented" role="group" aria-label="Movement mode">
        <button aria-pressed={!free} disabled={!canSwitch} onClick={() => send({ type: "mode:changed", mode: "guided" })}>
          Guided tour
        </button>
        <button aria-pressed={free} disabled={!canSwitch} onClick={() => send({ type: "mode:changed", mode: "free" })}>
          Free explore
        </button>
      </div>
      <button
        className="btn btn--tool"
        aria-pressed={orbit}
        title="Drag to rotate 360 degrees, scroll or pinch to zoom"
        onClick={() => setCameraMode(orbit ? "follow" : "orbit")}
      >
        {orbit ? "Reset view" : "Orbit view"}
      </button>
      <button className="btn btn--tool" aria-pressed={false} onClick={toggleFullscreen}>
        Fullscreen
      </button>
      <button className="btn btn--tool" aria-pressed={panel === "directory"} onClick={() => toggle("directory")}>
        Directory
      </button>
      <button className="btn btn--tool" aria-pressed={panel === "team"} onClick={() => toggle("team")}>
        Team
      </button>
      <button className="btn btn--tool" aria-pressed={panel === "help"} onClick={() => toggle("help")}>
        Controls
      </button>
      <button className="btn btn--tool" aria-pressed={panel === "settings"} onClick={() => toggle("settings")}>
        Settings
      </button>
      <button className="btn btn--tool" aria-pressed={muted} onClick={() => (audio.unlock(), set({ muted: !muted }))}>
        {muted ? "Sound off" : "Sound on"}
      </button>
    </div>
  );
}

export function DirectoryPanel() {
  const panel = useUi((s) => s.panel);
  const close = useUi((s) => s.close);
  const { name, context } = useExperience();
  if (panel !== "directory") return null;
  const enabled = INTERACTIVE_STATES.includes(name);

  const groups = [
    { title: "Departments & Executive", ids: ["manager-cabin", "it-department", "hr-department", "sales-department", "conference-hall"] },
    { title: "Lobby & Hospitality", ids: ["reception", "waiting-lounge", "office-kitchen"] },
    { title: "Exterior & Parking", ids: ["main-gate", "car-parking", "bike-parking"] },
  ];

  return (
    <aside className="panel panel--side" aria-label="Directory">
      <PanelHead title="Office Directory" onClose={close} />
      {groups.map((grp) => (
        <div key={grp.title} className="directory-group">
          <span className="directory-group__title">{grp.title}</span>
          <ul className="directory">
            {grp.ids.map((id) => {
              const d = destinationById(id);
              if (!d) return null;
              return (
                <li key={d.id}>
                  <button
                    className="btn btn--choice"
                    disabled={!enabled}
                    aria-current={context.destinationId === d.id ? "true" : undefined}
                    onClick={() => {
                      audio.play("ui");
                      send({ type: "destination:selected", destinationId: d.id });
                      close();
                    }}
                  >
                    {d.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <TourButton enabled={enabled} onDone={close} />
      {(name === "freeExplore" || name === "destinationChoice") && (
        <button className="btn btn--quiet" onClick={() => (send({ type: "experience:exit" }), close())}>
          End visit
        </button>
      )}
    </aside>
  );
}

export function TeamPanel() {
  const panel = useUi((s) => s.panel);
  const close = useUi((s) => s.close);
  const { name } = useExperience();
  if (panel !== "team") return null;
  const enabled = INTERACTIVE_STATES.includes(name);

  const namedTeam = characters.filter((c) =>
    ["umesh", "abhishek", "receptionist", "ankita", "bhavishya", "dravya"].includes(c.id),
  );

  return (
    <aside className="panel panel--side panel--team" aria-label="Team Directory">
      <PanelHead title="Leadership & Team" onClose={close} />
      <ul className="team-list">
        {namedTeam.map((m) => (
          <li key={m.id} className="team-card">
            <div className="team-card__info">
              <span className="team-card__avatar">{m.displayName.charAt(0)}</span>
              <div className="team-card__meta">
                <strong className="team-card__name">{m.displayName}</strong>
                <span className="team-card__role">{m.role}</span>
              </div>
            </div>
            <div className="team-card__actions">
              <button
                className="btn btn--choice btn--small"
                disabled={!enabled}
                onClick={() => {
                  audio.play("ui");
                  send({ type: "destination:selected", destinationId: m.departmentId });
                  close();
                }}
              >
                Go to Room
              </button>
              {m.conversationId && (
                <button
                  className="btn btn--primary btn--small"
                  disabled={!enabled}
                  onClick={() => {
                    audio.play("ui");
                    send({ type: "interaction:started", targetId: m.id });
                    close();
                  }}
                >
                  Speak
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function TourButton({ enabled, onDone }: { enabled: boolean; onDone: () => void }) {
  const active = useTour((t) => t.active);
  const { start, stop } = useTour.getState();
  return (
    <button
      className="btn btn--primary"
      disabled={!enabled}
      onClick={() => {
        audio.play("ui");
        if (active) stop();
        else {
          start();
          onDone();
        }
      }}
    >
      {active ? "Stop the tour" : "Start the full tour"}
    </button>
  );
}

export function HelpPanel() {
  const panel = useUi((s) => s.panel);
  const close = useUi((s) => s.close);
  if (panel !== "help") return null;
  return (
    <aside className="panel panel--side" aria-label="Controls">
      <PanelHead title="Controls" onClose={close} />
      <dl className="keys">
        <dt>W A S D or arrow keys</dt>
        <dd>Walk (Free explore)</dd>
        <dt>E</dt>
        <dd>Talk to someone nearby, or knock on the manager's door</dd>
        <dt>Esc</dt>
        <dd>Pause or resume</dd>
        <dt>Directory</dt>
        <dd>Pick a place and be guided there</dd>
        <dt>Orbit view</dt>
        <dd>Drag to rotate 360 degrees, scroll or pinch to zoom, right-drag or two fingers to pan</dd>
        <dt>Open or close the gate</dt>
        <dd>Stand at the gate controls, just inside the vehicle gate, and press E</dd>
        <dt>Skip walk</dt>
        <dd>Jump to the end of the current walk</dd>
      </dl>
    </aside>
  );
}

export function SettingsPanel() {
  const panel = useUi((s) => s.panel);
  const close = useUi((s) => s.close);
  const s = useSettings();
  if (panel !== "settings") return null;
  return (
    <aside className="panel panel--side" aria-label="Settings">
      <PanelHead title="Settings" onClose={close} />
      <div className="field">
        <label htmlFor="vol">Volume</label>
        <input id="vol" type="range" min={0} max={1} step={0.05} value={s.volume} onChange={(e) => s.set({ volume: Number(e.target.value) })} />
      </div>
      <div className="field">
        <label htmlFor="q">Graphics quality</label>
        <select id="q" value={s.quality} onChange={(e) => s.set({ quality: e.target.value as "high" | "medium" | "low" })}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low (best for slower computers)</option>
        </select>
      </div>
      <div className="field field--check">
        <input id="rm" type="checkbox" checked={s.reducedMotion} onChange={(e) => s.set({ reducedMotion: e.target.checked })} />
        <label htmlFor="rm">Reduce camera motion</label>
      </div>
      <div className="field" style={{ marginTop: "1rem" }}>
        <button
          className="btn btn--choice btn--small"
          onClick={() => {
            close();
            restartExperience();
          }}
        >
          Restart Experience
        </button>
      </div>
    </aside>
  );
}

export function ActionBar() {
  const { name, sub, nearby } = useExperience();
  const skipLabel = name === "arrival" || name === "guidedTravel" ? "Skip walk" : name === "managerDoor" ? "Skip visit" : null;
  const showTalk = nearby && (name === "freeExplore" || name === "destinationChoice");
  return (
    <div className="actionbar">
      {name === "managerDoor" && sub === "awaitingKnock" && (
        <button className="btn btn--primary btn--big" onClick={() => send({ type: "door:knocked" })}>
          Knock on the door
        </button>
      )}
      {showTalk && nearby && (
        <button className="btn btn--prompt" onClick={interact}>
          <kbd>E</kbd> {nearby.verb} {nearby.label}
        </button>
      )}
      {skipLabel && (
        <button className="btn btn--quiet btn--skip" onClick={() => send({ type: "skip:requested" })}>
          {skipLabel}
        </button>
      )}
    </div>
  );
}

export function Minimap() {
  const name = useExperience((s) => s.name);
  const ref = useRef<HTMLCanvasElement>(null);
  const hidden = ["loading", "welcome", "failed"].includes(name);
  useEffect(() => {
    if (hidden) return;
    const c = ref.current;
    if (!c) return;
    const g = c.getContext("2d");
    if (!g) return;
    const W = c.width;
    const H = c.height;
    const B = { x0: COMPOUND.x0, x1: COMPOUND.x1, z0: COMPOUND.z0, z1: COMPOUND.z1 + 8 };
    const sx = (x: number) => ((x - B.x0) / (B.x1 - B.x0)) * W;
    const sz = (z: number) => ((z - B.z0) / (B.z1 - B.z0)) * H;
    const rect = (r: { x0: number; x1: number; z0: number; z1: number }, fill: string) => {
      g.fillStyle = fill;
      g.fillRect(sx(r.x0), sz(r.z0), sx(r.x1) - sx(r.x0), sz(r.z1) - sz(r.z0));
    };
    const draw = () => {
      g.clearRect(0, 0, W, H);
      g.fillStyle = "#264a3b";
      g.fillRect(0, 0, W, H);
      for (const r of roads) rect(r.rect, "#4a5558");
      for (const p of paths) rect(p.rect, "#8f8a7c");
      for (const z of zones) rect({ x0: z.rect.x0 + 0.5, x1: z.rect.x1 - 0.5, z0: z.rect.z0 + 0.5, z1: z.rect.z1 - 0.5 }, z.id === "reception" ? "#4d7f7a" : "#2f565b");
      for (const z of exteriorZones) {
        g.strokeStyle = "rgba(200,164,90,0.7)";
        g.lineWidth = 1;
        g.strokeRect(sx(z.rect.x0), sz(z.rect.z0), sx(z.rect.x1) - sx(z.rect.x0), sz(z.rect.z1) - sz(z.rect.z0));
      }
      for (const ch of world.sim.chars.values()) {
        g.fillStyle = ch.def.roleUnconfirmed || ch.def.id === "umesh" || ch.def.id === "abhishek" ? "#c8a45a" : "#9db8b4";
        g.fillRect(sx(ch.nav.pos.x) - 1.5, sz(ch.nav.pos.z) - 1.5, 3, 3);
      }
      const v = world.sim.visitor.pos;
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(sx(v.x), sz(v.z), 4, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#2f8a7e";
      g.lineWidth = 2;
      g.stroke();
    };
    draw();
    const id = window.setInterval(draw, 120);
    return () => window.clearInterval(id);
  }, [hidden]);
  if (hidden) return null;
  return <canvas ref={ref} className="minimap" width={130} height={180} role="img" aria-label="Property map showing your position" />;
}

export function PauseOverlay() {
  const paused = useExperience((s) => s.context.paused);
  if (!paused) return null;
  return (
    <div className="overlay" role="dialog" aria-label="Paused">
      <div className="card">
        <h2>Paused</h2>
        <p>The office is on hold.</p>
        <div className="card__actions">
          <button className="btn btn--primary" onClick={() => send({ type: "experience:resumed" })}>
            Resume
          </button>
          <button className="btn btn--quiet" onClick={restartExperience}>
            Restart visit
          </button>
        </div>
      </div>
    </div>
  );
}

export function TourBanner() {
  const tour = useTour();
  if (!tour.active || tour.index < 0) return null;
  const stopId = TOUR_STOPS[tour.index] ?? "";
  const dest = destinationById(stopId);
  const isFirst = tour.index === 0;
  const isLast = tour.index === TOUR_STOPS.length - 1;

  return (
    <div className="tour-controller" role="region" aria-label="Guided Tour Controls">
      <div className="tour-controller__info">
        <span className="tour-controller__badge">
          Stop {tour.index + 1} of {TOUR_STOPS.length}
        </span>
        <strong className="tour-controller__title">{dest?.label ?? "Tour Stop"}</strong>
        <p className="tour-controller__desc">{dest?.objective ?? "Exploring the workspace."}</p>
      </div>
      <div className="tour-controller__actions">
        <button
          className="btn btn--choice"
          disabled={isFirst}
          onClick={() => {
            audio.play("ui");
            tour.prev();
          }}
          aria-label="Previous tour stop"
        >
          Previous
        </button>
        <button
          className="btn btn--primary"
          onClick={() => {
            audio.play("ui");
            if (isLast) tour.stop();
            else tour.next();
          }}
          aria-label={isLast ? "Complete tour" : "Next tour stop"}
        >
          {isLast ? "Done" : "Next"}
        </button>
        <button
          className="btn btn--quiet"
          onClick={() => {
            audio.play("ui");
            tour.stop();
          }}
          aria-label="Exit guided tour"
        >
          Exit tour
        </button>
      </div>
    </div>
  );
}

const DPAD_BUTTONS = [
  { cls: "dpad-up", label: "Walk forward", glyph: "\u25B2", x: 0, z: 1 },
  { cls: "dpad-left", label: "Turn left", glyph: "\u25C0", x: -1, z: 0 },
  { cls: "dpad-down", label: "Walk backward", glyph: "\u25BC", x: 0, z: -1 },
  { cls: "dpad-right", label: "Turn right", glyph: "\u25B6", x: 1, z: 0 },
] as const;

export function TouchDpad() {
  const { name, context } = useExperience();
  const free = context.mode === "free" || name === "freeExplore";
  if (!free || ["loading", "welcome", "failed", "dialogue", "managerDialogue", "exit"].includes(name)) return null;

  const release = () => setTouchInput(0, 0);
  const [up, ...rest] = DPAD_BUTTONS;
  const renderButton = (b: (typeof DPAD_BUTTONS)[number]) => (
    <button
      key={b.cls}
      className={`dpad-btn ${b.cls}`}
      aria-label={b.label}
      onPointerDown={() => {
        audio.unlock();
        setTouchInput(b.x, b.z);
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      {b.glyph}
    </button>
  );

  return (
    <div className="touch-dpad" aria-label="Touch movement controls">
      {renderButton(up)}
      <div className="dpad-row">{rest.map(renderButton)}</div>
    </div>
  );
}

export function Toast() {
  const toast = useUi((s) => s.toast);
  if (!toast) return null;
  return (
    <aside className="toast-banner" role="status" aria-live="polite">
      {toast}
    </aside>
  );
}

export function restartExperience() {
  world.sim.reset();
  useDialogue.getState().close();
  useTour.getState().stop();
  useUi.getState().close();
  useUi.getState().setToast(null);
  useLoading.getState().reset();
  send({ type: "experience:restart" });
}
