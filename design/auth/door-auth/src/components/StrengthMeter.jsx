import { STRENGTH_LABELS, passwordStrength } from "../lib/validation.js";

export default function StrengthMeter({ password }) {
  const score = passwordStrength(password);
  return (
    <>
      <div className="meter" data-s={score} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="mlabel" aria-live="polite">
        {password ? STRENGTH_LABELS[score] : ""}
      </div>
    </>
  );
}
