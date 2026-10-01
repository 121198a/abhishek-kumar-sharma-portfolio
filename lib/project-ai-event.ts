// Minimal shared contract for "Ask AI about this project" (Project Deep
// Dive) and AI Prompt triggers. Projects, AIIntro and AIChat are sibling client
// components rendered independently in app/page.tsx — a browser CustomEvent
// avoids introducing a heavy React Context provider just for this.

export const ASK_AI_PROJECT_EVENT = "ask-ai-project";
export const OPEN_AI_CHAT_EVENT = "open-ai-chat";

export type AskAiProjectDetail = {
  slug: string;
  name: string;
};

export type OpenAiChatDetail = {
  initialQuestion?: string;
  mode?: "general" | "recruiter";
};

export function dispatchAskAiProject(detail: AskAiProjectDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AskAiProjectDetail>(ASK_AI_PROJECT_EVENT, { detail }));
}

export function dispatchOpenAiChat(detail?: OpenAiChatDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<OpenAiChatDetail>(OPEN_AI_CHAT_EVENT, { detail }));
}
