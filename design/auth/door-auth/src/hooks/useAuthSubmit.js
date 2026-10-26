import { useEffect, useState } from "react";

const EMPTY = { text: "", kind: "" };

/**
 * Shared submit flow: validate -> loading -> run -> feedback.
 * `validate()` must show field errors and return a boolean.
 * `run()` may return a success message; thrown errors become error feedback.
 * Feedback is cleared whenever `active` flips (the view was shown or hidden).
 */
export function useAuthSubmit({ active, validate, run }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(EMPTY);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setFeedback(EMPTY);
  }, [active]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (!validate()) {
      setShake(true);
      setFeedback({ text: "Please fix the highlighted fields.", kind: "bad" });
      return;
    }

    setLoading(true);
    setFeedback(EMPTY);
    try {
      const message = await run();
      if (message) setFeedback({ text: message, kind: "good" });
    } catch (error) {
      setFeedback({
        text: error?.message || "Something went wrong. Please try again.",
        kind: "bad",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    feedback,
    setFeedback,
    shake,
    endShake: () => setShake(false),
    handleSubmit,
  };
}
