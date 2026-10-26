import { useState } from "react";
import { AuthAdapter } from "../lib/auth.js";
import { PROVIDERS } from "../lib/providers.js";

/** Google / LinkedIn / GitHub buttons. `verb` reads "log in" or "sign up". */
export default function SocialButtons({ verb, onFeedback }) {
  const [busy, setBusy] = useState(null);

  const start = async (provider) => {
    setBusy(provider);
    onFeedback({ text: "", kind: "" });
    try {
      await AuthAdapter.oauth(provider);
    } catch (error) {
      onFeedback({ text: error.message, kind: "bad" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="or">
        <span>or {verb} with</span>
      </div>
      <div className="socs">
        {PROVIDERS.map(({ name, paths }) => (
          <button
            key={name}
            type="button"
            className={`soc${busy === name ? " load" : ""}`}
            aria-label={`Continue with ${name}`}
            onClick={() => start(name)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {paths.map((p) => (
                <path key={p.d} fill={p.fill} d={p.d} />
              ))}
            </svg>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
