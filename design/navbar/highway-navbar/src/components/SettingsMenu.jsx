import { PRESETS } from "../hooks/useTheme.js";
export default function SettingsMenu({
  preset,
  setPreset,
  systemReduced,
  force,
  setForce,
}) {
  return (
    <section className="pop" aria-label="Animation speed">
      <p>Animation speed</p>
      <div className="seg">
        {Object.keys(PRESETS).map((p) => (
          <button
            key={p}
            aria-pressed={preset === p}
            onClick={() => setPreset(p)}
          >
            {p}
          </button>
        ))}
      </div>
      {systemReduced && (
        <>
          <small>
            Your system asks for reduced motion, so scenery is paused and swaps
            are instant.
          </small>
          <button
            className="vm-anyway"
            aria-pressed={force}
            onClick={() => setForce(!force)}
          >
            {force ? "Animating (tap to calm)" : "Animate anyway"}
          </button>
        </>
      )}
    </section>
  );
}
