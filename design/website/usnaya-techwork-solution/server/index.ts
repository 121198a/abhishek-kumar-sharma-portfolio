import { createApp } from "./app";
import { createAnthropicProvider, createLocalProvider } from "./ai/provider";

const env = process.env;
const kind = env.AI_PROVIDER ?? "local";

let provider = createLocalProvider();
if (kind === "anthropic") {
  const apiKey = env.AI_PROVIDER_API_KEY;
  const model = env.AI_PROVIDER_MODEL;
  if (!apiKey || apiKey.startsWith("replace-") || !model || model.startsWith("replace-")) {
    console.error("AI_PROVIDER=anthropic needs AI_PROVIDER_API_KEY and AI_PROVIDER_MODEL. Falling back to the local provider.");
  } else {
    provider = createAnthropicProvider({ apiKey, model });
  }
}

const port = Number(env.PORT ?? 8787);
const allowedOrigins = (env.ALLOWED_ORIGINS ?? "http://localhost:5173").split(",").map((s) => s.trim());
const dailyCap = Number(env.DAILY_REQUEST_CAP ?? 500);

createApp({ provider, allowedOrigins, dailyCap }).listen(port, () => {
  console.log(`USNAYA conversation API on :${port} (provider: ${provider.name})`);
});
