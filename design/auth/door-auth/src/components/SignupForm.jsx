import { useEffect, useState } from "react";
import Field from "./Field.jsx";
import SocialButtons from "./SocialButtons.jsx";
import StrengthMeter from "./StrengthMeter.jsx";
import SubmitButton from "./SubmitButton.jsx";
import { useFormFields } from "../hooks/useFormFields.js";
import { useAuthSubmit } from "../hooks/useAuthSubmit.js";
import { AuthAdapter } from "../lib/auth.js";
import { DRAFT_KEYS } from "../lib/storage.js";

const SCHEMA = {
  name: "name",
  email: "email",
  password: "pwNew",
  confirm: "match",
};
const INITIAL = { name: "", email: "", password: "", confirm: "" };
// Non-sensitive fields kept as a draft in localStorage. Passwords are never stored.
const DRAFT = { draftKey: DRAFT_KEYS.signup, draftFields: ["name", "email"] };

export default function SignupForm({
  active,
  sceneOn,
  clearSignal,
  onSuccess,
  onReady,
}) {
  const form = useFormFields(SCHEMA, INITIAL, DRAFT);
  const [accepted, setAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");

  const valid = form.isValid && accepted;

  const submit = useAuthSubmit({
    active,
    validate: () => {
      const fieldsOk = form.validateAll();
      setTermsError(accepted ? "" : "Please accept the terms to continue.");
      return fieldsOk && accepted;
    },
    run: async () => {
      const { name, email, password } = form.values;
      const result = await AuthAdapter.signup({ name, email, password });
      form.clearDraft();
      onSuccess(result.name || email.split("@")[0]);
    },
  });

  useEffect(() => {
    if (active) onReady(valid);
  }, [active, valid, onReady]);

  useEffect(() => {
    if (clearSignal) form.clearFields(["password", "confirm"]);
  }, [clearSignal, form.clearFields]);

  return (
    <form id="f-signup" onSubmit={submit.handleSubmit} noValidate>
      <div className="pair">
        <Field
          id="su-name"
          label="Full name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          {...form.fieldProps("name")}
        />
        <Field
          id="su-em"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@domain.com"
          {...form.fieldProps("email")}
        />
      </div>
      <div className="pair">
        <div>
          <Field
            id="su-pw"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="8+ chars, 1 number"
            {...form.fieldProps("password")}
          />
          <StrengthMeter password={form.values.password} />
        </div>
        <Field
          id="su-pw2"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat password"
          {...form.fieldProps("confirm")}
        />
      </div>
      <div className="row">
        <label>
          <input
            type="checkbox"
            checked={accepted}
            required
            aria-describedby="su-terms-e"
            aria-invalid={termsError ? true : undefined}
            onChange={(e) => {
              setAccepted(e.target.checked);
              if (e.target.checked) setTermsError("");
            }}
          />
          I accept the terms &amp; privacy policy
        </label>
      </div>
      <div className="err terr" id="su-terms-e" role="alert">
        {termsError}
      </div>
      <SubmitButton
        label="Create account"
        runaway
        active={active}
        valid={valid}
        loading={submit.loading}
        sceneOn={sceneOn}
        shake={submit.shake}
        onShakeEnd={submit.endShake}
      />
      <p className={`fb ${submit.feedback.kind}`} role="status" aria-live="polite">
        {submit.feedback.text}
      </p>
      <SocialButtons verb="sign up" onFeedback={submit.setFeedback} />
    </form>
  );
}
