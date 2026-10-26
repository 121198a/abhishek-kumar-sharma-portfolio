import { renderToString } from "react-dom/server";
import App from "./App.jsx";

/** Static HTML of the app (login view). Used to pre-render index.html. */
export function render() {
  return renderToString(<App />);
}
