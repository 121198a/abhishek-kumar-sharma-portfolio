import { PRESETS } from "../hooks/useTheme.js";
export default function SettingsMenu({ preset, setPreset, reduced }) {
  return (
    <div className="pop pop-settings" role="group" aria-label="Animation speed">
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
      {reduced && (
        <small>
          Reduced motion is on in your system, so animations are minimal.
        </small>
      )}
    </div>
  );
}
