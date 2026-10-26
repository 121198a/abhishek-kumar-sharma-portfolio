import { useEffect } from "react";
import Field from "./Field.jsx";
import SubmitButton from "./SubmitButton.jsx";
import { useFormFields } from "../hooks/useFormFields.js";
import { useAuthSubmit } from "../hooks/useAuthSubmit.js";
import { AuthAdapter } from "../lib/auth.js";
import { DRAFT_KEYS } from "../lib/storage.js";

const SCHEMA = { email: "email" };
const INITIAL = { email: "" };
const DRAFT = { draftKey: DRAFT_KEYS.forgot, draftFields: ["email"] };

export default function ForgotForm({ active, onReady }) {
  const form = useFormFields(SCHEMA, INITIAL, DRAFT);

  const submit = useAuthSubmit({
    active,
    validate: form.validateAll,
    run: async () => {
      await AuthAdapter.forgot({ email: form.values.email });
      form.clearDraft();
      return "Demo: a reset link would be emailed once a backend is connected.";
    },
  });

  // The hero door only opens for the runaway forms.
  useEffect(() => {
    if (active) onReady(false);
  }, [active, onReady]);

  return (
    <form id="f-forgot" onSubmit={submit.handleSubmit} noValidate>
      <Field
        id="fg-em"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@domain.com"
        {...form.fieldProps("email")}
      />
      <SubmitButton
        label="Send reset link"
        active={active}
        valid={form.isValid}
        loading={submit.loading}
        shake={submit.shake}
        onShakeEnd={submit.endShake}
      />
      <p className={`fb ${submit.feedback.kind}`} role="status" aria-live="polite">
        {submit.feedback.text}
      </p>
    </form>
  );
}
