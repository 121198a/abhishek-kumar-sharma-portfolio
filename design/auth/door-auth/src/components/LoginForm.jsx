import { useEffect, useState } from "react";
import Field from "./Field.jsx";
import SocialButtons from "./SocialButtons.jsx";
import SubmitButton from "./SubmitButton.jsx";
import { useFormFields } from "../hooks/useFormFields.js";
import { useAuthSubmit } from "../hooks/useAuthSubmit.js";
import { AuthAdapter } from "../lib/auth.js";

const SCHEMA = { email: "email", password: "pwLogin" };
const STORAGE_KEY = "emberdoor:v1:login:remembered-email";
const LEGACY_STORAGE_KEY = "ed_email";

function readSavedEmail() {
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current) return current;
    // One-time compatibility migration for versions that used the old key.
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY) || "";
    if (legacy) {
      window.localStorage.setItem(STORAGE_KEY, legacy);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    return legacy;
  } catch {
    return "";
  }
}

export default function LoginForm({
  active,
  sceneOn,
  clearSignal,
  onSuccess,
  onForgot,
  onReady,
}) {
  const [saved] = useState(readSavedEmail);
  const [remember, setRemember] = useState(Boolean(saved));
  const form = useFormFields(SCHEMA, { email: saved, password: "" });

  const submit = useAuthSubmit({
    active,
    validate: form.validateAll,
    run: async () => {
      const { email, password } = form.values;
      const result = await AuthAdapter.login({ email, password });
      onSuccess(result.name || email.split("@")[0]);
    },
  });

  // Persist only the email when the user explicitly opts into “Remember me”.
  // Passwords are deliberately excluded from all browser storage.
  useEffect(() => {
    try {
      if (remember && form.values.email.trim()) {
        window.localStorage.setItem(STORAGE_KEY, form.values.email.trim());
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      } else if (!remember) {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch {
      // Storage can be disabled or full; form interaction must still work.
    }
  }, [remember, form.values.email]);

  useEffect(() => {
    if (active) onReady(form.isValid);
  }, [active, form.isValid, onReady]);

  useEffect(() => {
    if (clearSignal) form.clearFields(["password"]);
  }, [clearSignal, form.clearFields]);

  return (
    <form id="f-login" onSubmit={submit.handleSubmit} noValidate>
      <Field
        id="li-em"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@domain.com"
        {...form.fieldProps("email")}
      />
      <Field
        id="li-pw"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="At least 6 characters"
        {...form.fieldProps("password")}
      />
      <div className="row">
        <label>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>
        <button type="button" className="link" onClick={onForgot}>
          Forgot password?
        </button>
      </div>
      <SubmitButton
        label="Open the door"
        runaway
        active={active}
        valid={form.isValid}
        loading={submit.loading}
        sceneOn={sceneOn}
        shake={submit.shake}
        onShakeEnd={submit.endShake}
      />
      <p className={`fb ${submit.feedback.kind}`} role="status" aria-live="polite">
        {submit.feedback.text}
      </p>
      <SocialButtons verb="log in" onFeedback={submit.setFeedback} />
    </form>
  );
}
