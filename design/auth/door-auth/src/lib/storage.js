/* Small localStorage helpers. Every call is wrapped: storage can be blocked
   (private mode, quota, disabled cookies) and the UI must keep working. */

const LEGACY_KEY_MAP = {
  "emberdoor:v1:draft:signup": "ed_draft_signup",
  "emberdoor:v1:draft:forgot": "ed_draft_forgot",
  "emberdoor:v1:draft-stamps": "ed_draft_stamps",
};

export function readJSON(key) {
  try {
    let raw = window.localStorage.getItem(key);
    if (!raw && LEGACY_KEY_MAP[key]) {
      // Migrate a previous unversioned draft once, then use the versioned key.
      raw = window.localStorage.getItem(LEGACY_KEY_MAP[key]);
      if (raw) {
        window.localStorage.setItem(key, raw);
        window.localStorage.removeItem(LEGACY_KEY_MAP[key]);
      }
    }
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Malformed or inaccessible data must never prevent the form from rendering.
    // Remove corrupt JSON when storage is accessible so it cannot be retried forever.
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* storage unavailable: ignore */
    }
    return null;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: ignore */
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable: ignore */
  }
}

/* ---- Draft lifecycle -------------------------------------------------------
   Drafts hold personal data (name, email), so they expire instead of living in
   the browser forever. A separate map records when each draft was last saved. */

export const DRAFT_KEYS = {
  signup: "emberdoor:v1:draft:signup",
  forgot: "emberdoor:v1:draft:forgot",
};
export const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const STAMPS_KEY = "emberdoor:v1:draft-stamps";

export function saveDraft(key, fields, now = Date.now()) {
  writeJSON(key, fields);
  writeJSON(STAMPS_KEY, { ...(readJSON(STAMPS_KEY) || {}), [key]: now });
}

export function deleteDraft(key) {
  removeKey(key);
  const { [key]: _removed, ...rest } = readJSON(STAMPS_KEY) || {};
  if (Object.keys(rest).length) writeJSON(STAMPS_KEY, rest);
  else removeKey(STAMPS_KEY);
}

/**
 * Remove drafts older than the TTL. Drafts saved before expiry tracking
 * existed (no timestamp) get one now instead of being deleted.
 * Call once at startup. Returns the keys that were removed.
 */
export function purgeExpiredDrafts(keys = Object.values(DRAFT_KEYS), now = Date.now()) {
  const stamps = readJSON(STAMPS_KEY) || {};
  const removed = [];
  for (const key of keys) {
    const savedAt = stamps[key];
    if (typeof savedAt === "number" && now - savedAt > DRAFT_TTL_MS) {
      deleteDraft(key);
      removed.push(key);
    } else if (savedAt === undefined && readJSON(key)) {
      writeJSON(STAMPS_KEY, { ...(readJSON(STAMPS_KEY) || {}), [key]: now });
    }
  }
  return removed;
}
