import { useState } from "react";

function EyeIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

/** Labelled input with an inline error. Password fields get a show/hide toggle. */
export default function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  validated,
  ...inputProps
}) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const errorId = `${id}-e`;

  return (
    <div className="fw">
      <label htmlFor={id}>{label}</label>
      <div className="f">
        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={validated ? Boolean(error) : undefined}
          aria-describedby={errorId}
          className={validated && !error ? "good" : undefined}
          required
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            className="eye"
            aria-label={`${revealed ? "Hide" : "Show"} password`}
            aria-pressed={revealed}
            onClick={() => setRevealed((r) => !r)}
          >
            <EyeIcon off={revealed} />
          </button>
        )}
      </div>
      <div className="err" id={errorId} role="alert">
        {error}
      </div>
    </div>
  );
}
