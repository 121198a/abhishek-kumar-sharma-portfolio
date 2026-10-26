import "@fontsource/familjen-grotesk/500.css";
import "@fontsource/familjen-grotesk/700.css";
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/600.css";
import "./styles/tokens.css";
import "./styles/app.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";

const el = document.getElementById("root");
if (!el) throw new Error("Missing #root element");
createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
