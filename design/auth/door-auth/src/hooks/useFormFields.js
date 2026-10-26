import { useCallback, useEffect, useMemo, useState } from "react";
import { checkField } from "../lib/validation.js";
import { deleteDraft, readJSON, saveDraft } from "../lib/storage.js";

/**
 * Controlled form state with rule-based validation.
 * Errors are only *shown* for fields that were validated by a submit attempt;
 * after that they update live while typing.
 *
 * @param {Record<string,string>} schema  field name -> rule name (keep it module-level/stable)
 * @param {Record<string,string>} initialValues
 * @param {{ draftKey?: string, draftFields?: string[] }} [options]
 *   With `draftKey`, the listed `draftFields` are saved to localStorage while
 *   the visitor types and restored on the next visit. Only list non-sensitive
 *   fields: never passwords.
 */
export function useFormFields(schema, initialValues, { draftKey, draftFields = [] } = {}) {
  const [values, setValues] = useState(() => {
    if (!draftKey) return initialValues;
    const saved = readJSON(draftKey);
    // Only restore explicitly allow-listed string fields from a plain object.
    // This prevents stale/foreign data (including passwords) from entering form state.
    const isRecord = saved !== null && typeof saved === "object" && !Array.isArray(saved);
    const restored = Object.fromEntries(
      draftFields
        .filter((name) => isRecord && typeof saved[name] === "string")
        .map((name) => [name, saved[name]]),
    );
    return { ...initialValues, ...restored };
  });
  const [touched, setTouched] = useState({});

  const errors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(schema).map(([name, rule]) => [
          name,
          checkField(rule, values[name], values),
        ]),
      ),
    [schema, values],
  );

  const isValid = Object.values(errors).every((message) => !message);

  // Serialised so the effect only re-runs when an allow-listed draft field changes.
  // Initial state is hydrated synchronously above, so empty defaults never overwrite a saved draft.
  const draft = JSON.stringify(
    Object.fromEntries(draftFields.map((name) => [name, values[name] ?? ""])),
  );
  useEffect(() => {
    if (!draftKey) return;
    const fields = JSON.parse(draft);
    if (Object.values(fields).some(Boolean)) saveDraft(draftKey, fields);
    else deleteDraft(draftKey);
  }, [draftKey, draft]);

  const clearDraft = useCallback(() => {
    if (draftKey) deleteDraft(draftKey);
  }, [draftKey]);

  const validateAll = useCallback(() => {
    setTouched(Object.fromEntries(Object.keys(schema).map((name) => [name, true])));
    return Object.values(errors).every((message) => !message);
  }, [schema, errors]);

  const clearFields = useCallback((names) => {
    setValues((current) => ({
      ...current,
      ...Object.fromEntries(names.map((name) => [name, ""])),
    }));
    setTouched((current) => {
      const next = { ...current };
      names.forEach((name) => delete next[name]);
      return next;
    });
  }, []);

  const fieldProps = (name) => ({
    value: values[name],
    onChange: (value) => setValues((current) => ({ ...current, [name]: value })),
    error: touched[name] ? errors[name] : "",
    validated: Boolean(touched[name]),
  });

  return { values, isValid, validateAll, clearFields, clearDraft, fieldProps };
}
