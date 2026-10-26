import { useState } from "react";
import { destinations } from "../data/destinations";
import { eventLog, send } from "../experience/ExperienceDirector";
import type { ExperienceEvent } from "../experience/ExperienceEvents";
import { useExperience } from "../store/experienceStore";

/** Development only. Removed from production builds (see App.tsx, guarded by import.meta.env.DEV). */
export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const { name, sub, context } = useExperience();
  const fire = (e: ExperienceEvent) => send(e);
  return (
    <div className="debug">
      <button className="btn btn--quiet" onClick={() => setOpen(!open)}>
        Debug {open ? "▾" : "▸"}
      </button>
      {open && (
        <div className="debug__body">
          <p>
            <b>{name}</b>
            {sub ? ` / ${sub}` : ""} · mode {context.mode} · route {context.routeId} · dest {context.destinationId ?? "-"}
          </p>
          <div className="debug__row">
            {destinations.map((d) => (
              <button key={d.id} onClick={() => fire({ type: "destination:selected", destinationId: d.id })}>
                {d.id}
              </button>
            ))}
          </div>
          <div className="debug__row">
            <button onClick={() => fire({ type: "skip:requested" })}>skip</button>
            <button onClick={() => fire({ type: "door:knocked" })}>knock</button>
            <button onClick={() => fire({ type: "dialogue:completed" })}>dialogue done</button>
            <button onClick={() => fire({ type: "mode:changed", mode: "free" })}>free</button>
            <button onClick={() => fire({ type: "mode:changed", mode: "guided" })}>guided</button>
          </div>
          <pre>{eventLog.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}
