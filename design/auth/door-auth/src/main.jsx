import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { purgeExpiredDrafts } from "./lib/storage.js";
import "./styles/theme.css";
import "./styles/style.css";

// index.html's draft bridge saved anything typed before this bundle loaded; flush it and
// hand over to React (the hooks read the same localStorage keys when the forms mount).
window.__emberdoorDraftBridge?.stop();

// Saved form drafts expire after 7 days; clear stale ones before the app reads them.
purgeExpiredDrafts();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
