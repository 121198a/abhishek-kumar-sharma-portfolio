import { useRunaway } from "../hooks/useRunaway.js";

/**
 * The form's primary button. With `runaway`, it dodges the pointer while the
 * form is invalid (disabled under prefers-reduced-motion) and shows a hint.
 */
export default function SubmitButton({
  label,
  active,
  valid,
  loading,
  runaway = false,
  sceneOn = false,
  shake,
  onShakeEnd,
}) {
  const { btnRef, arenaRef, nudged } = useRunaway({
    enabled: runaway,
    active,
    valid,
    loading,
    sceneOn,
  });

  const className = [
    "go",
    runaway && !valid && "run",
    loading && "load",
    shake && "shake",
  ]
    .filter(Boolean)
    .join(" ");

  let hint = "";
  if (valid) hint = "Ready when you are.";
  else if (nudged) hint = "Nice try. Fill in valid details first.";

  return (
    <>
      <div className="arena" ref={arenaRef}>
        <button
          ref={btnRef}
          type="submit"
          className={className}
          disabled={loading}
          aria-disabled={runaway ? !valid : undefined}
          onAnimationEnd={(e) => {
            if (e.animationName === "sh") onShakeEnd?.();
          }}
        >
          {label}
        </button>
      </div>
      {runaway && (
        <p className="hint" aria-live="polite">
          {hint}
        </p>
      )}
    </>
  );
}
