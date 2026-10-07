"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ASK_AI_PROJECT_EVENT,
  OPEN_AI_CHAT_EVENT,
  type AskAiProjectDetail,
  type OpenAiChatDetail,
} from "@/lib/project-ai-event";
import { trackEvent, mapFallbackReason } from "@/lib/analytics";
import { formatAiResponse } from "@/lib/format";

type Msg = {
  role: "user" | "bot";
  text: string;
};

type ChatMode = "general" | "recruiter";

type ChatResponse = {
  reply?: string;
  mode?: "ai" | "fallback" | "limit" | "rate_limited";
  reason?: string;
  category?: string;
  error?: string;
};

const QUICK_LINKS = [
  { href: "#projects", label: "View Projects" },
  { href: "#skills", label: "View Skills" },
  { href: "/resume.pdf", label: "View Resume" },
  { href: "#contact", label: "Contact Abhishek" },
];

const SUGGESTED_QUESTIONS = [
  "Tell me about Abhishek",
  "What are his strongest skills?",
  "Tell me about his projects",
  "What is his research work?",
];

const INITIAL_GREETING =
  "Hi! I'm Abhishek AI. Ask me about verified technical skills, full-stack projects, internship experience, research publications, or recruiter evaluations.";

export default function AIChat({ aiEnabled }: { aiEnabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: INITIAL_GREETING,
    },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatMode>("general");
  const [selectedProject, setSelectedProject] = useState<AskAiProjectDetail | null>(null);
  const [sending, setSending] = useState(false);
  const [offline, setOffline] = useState(!aiEnabled);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const sentCount = useRef(0);
  const hasStartedChat = useRef(false);

  // Auto-scroll on new messages
  useEffect(() => {
    if (open) {
      bodyRef.current?.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        // Return focus to the launcher so keyboard users are not left stranded.
        launcherRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const sendQuery = useCallback(
    async (queryText: string, customMode?: ChatMode, projectSlug?: string) => {
      const q = queryText.trim();
      if (!q || sending) return;

      const activeMode = customMode ?? mode;
      const activeProjectSlug = projectSlug !== undefined ? projectSlug : selectedProject?.slug;

      // Add visitor message
      setMessages((current) => [...current, { role: "user", text: q }]);
      setInput("");
      setSending(true);

      const lastIdx = messages.length - 1;
      const history =
        messages.length >= 2 &&
        messages[lastIdx].role === "bot" &&
        messages[lastIdx - 1].role === "user"
          ? [
              { role: "user" as const, content: messages[lastIdx - 1].text },
              { role: "assistant" as const, content: messages[lastIdx].text },
            ]
          : [];

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: q,
            sessionMessageCount: sentCount.current,
            mode: activeMode,
            selectedProject: activeProjectSlug,
            history,
          }),
        });

        const data: ChatResponse = await res.json();
        sentCount.current += 1;

        if (!res.ok) {
          setMessages((current) => [
            ...current,
            {
              role: "bot",
              text: data.error ?? "Something went wrong. Please try again.",
            },
          ]);
          return;
        }

        if (data.mode === "ai") {
          setOffline(false);
          if (data.category) trackEvent("ai_question_category", { category: data.category });
        }

        if (data.mode === "fallback") {
          setOffline(true);
          trackEvent("fallback_used", { category: mapFallbackReason(data.reason) });
          if (data.category) trackEvent("ai_question_category", { category: data.category });
        }

        setMessages((current) => [
          ...current,
          {
            role: "bot",
            text: data.reply ?? "I couldn't generate an answer right now.",
          },
        ]);
      } catch {
        setOffline(true);
        setMessages((current) => [
          ...current,
          {
            role: "bot",
            text:
              "AI is temporarily unreachable. You can explore Abhishek's verified projects, skills, and resume directly below.",
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [messages, mode, selectedProject, sending]
  );

  // Handle Project Deep Dive event
  useEffect(() => {
    function handleAskAiProject(e: Event) {
      const detail = (e as CustomEvent<AskAiProjectDetail>).detail;
      if (!detail?.slug) return;
      setSelectedProject(detail);
      setOpen(true);
      trackEvent("project_view", { project: detail.name });
      trackEvent("project_ai_opened", { project: detail.name });

      // Automatically ask a project context question
      sendQuery(`Tell me about ${detail.name} and what technologies it uses.`, undefined, detail.slug);
    }
    window.addEventListener(ASK_AI_PROJECT_EVENT, handleAskAiProject);
    return () => window.removeEventListener(ASK_AI_PROJECT_EVENT, handleAskAiProject);
  }, [sendQuery]);

  // Handle Open AI Chat event (from AIIntro or CTAs)
  useEffect(() => {
    function handleOpenAiChat(e: Event) {
      const detail = (e as CustomEvent<OpenAiChatDetail>).detail;
      setOpen(true);
      if (!hasStartedChat.current) {
        hasStartedChat.current = true;
        trackEvent("ai_chat_started");
      }
      if (detail?.mode) {
        setMode(detail.mode);
      }
      if (detail?.initialQuestion) {
        sendQuery(detail.initialQuestion, detail.mode);
      } else {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
    window.addEventListener(OPEN_AI_CHAT_EVENT, handleOpenAiChat);
    return () => window.removeEventListener(OPEN_AI_CHAT_EVENT, handleOpenAiChat);
  }, [sendQuery]);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    sendQuery(input);
  }

  function handleClearChat() {
    setMessages([{ role: "bot", text: INITIAL_GREETING }]);
    setSelectedProject(null);
    sentCount.current = 0;
  }

  return (
    <>
      {/* Floating Assistant Trigger Button */}
      <button
        ref={launcherRef}
        type="button"
        onClick={(e) => {
          // e.detail === 0 means the click came from the keyboard (Enter/Space).
          // Only then move focus into the chat: on touch it would pop up the
          // on-screen keyboard and cover the conversation.
          const viaKeyboard = e.detail === 0;
          if (!open && viaKeyboard) setTimeout(() => inputRef.current?.focus(), 120);
          setOpen((v) => !v);
          if (!hasStartedChat.current) {
            hasStartedChat.current = true;
            trackEvent("ai_chat_started");
          }
        }}
        aria-label={open ? "Close Abhishek AI assistant" : "Open Abhishek AI assistant"}
        className="chat-launcher"
      >
        <span className="transition-transform duration-200">
          {open ? (
            <span className="text-xl">✕</span>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      {/* Floating Chat Dialog */}
      {open && (
        <div
         
          role="dialog"
          aria-label="Abhishek AI Assistant"
          aria-modal="false"
          className="fixed bottom-[88px] right-6 z-[60] flex w-[390px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line bg-panel2 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-panel text-xs font-bold text-purple">
                AI
              </span>
              <div>
                <span className="text-xs font-bold text-ink block leading-tight">
                  Abhishek AI
                </span>
                <span className="text-xs text-muted block">
                  Portfolio Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Online/Fallback status badge */}
              <span
                className={`badge-status ${
                  offline
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    offline ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
                  }`}
                />
                <span>{offline ? "OFFLINE / LOCAL" : "ONLINE"}</span>
              </span>

              {/* Clear chat button */}
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation"
                aria-label="Clear conversation"
                className="rounded-lg p-1.5 text-muted hover:bg-line/40 hover:text-ink transition-colors text-xs"
              >
                ↺
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="rounded-lg p-1.5 text-muted hover:bg-line/40 hover:text-ink transition-colors text-xs"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          <div
            role="group"
            aria-label="Chat persona mode"
            className="flex items-center justify-between border-b border-line bg-panel2/60 px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMode("general")}
                aria-pressed={mode === "general"}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                  mode === "general"
                    ? "bg-purple text-white shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                General
              </button>
              <button
                type="button"
                onClick={() => {
                  if (mode !== "recruiter") trackEvent("recruiter_mode", { enabled: true });
                  setMode("recruiter");
                }}
                aria-pressed={mode === "recruiter"}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                  mode === "recruiter"
                    ? "bg-purple text-white shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                Recruiter Mode
              </button>
            </div>
            <span className="text-xs text-muted font-medium">
              {mode === "recruiter" ? "Fact → Evidence" : "General"}
            </span>
          </div>

          {/* Selected Project Focus Banner */}
          {selectedProject && (
            <div className="flex items-center justify-between border-b border-line bg-purple/10 px-3 py-1.5 text-xs">
              <span className="truncate text-purple font-medium">
                Active Context: <strong className="font-bold">{selectedProject.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Clear project focus"
                className="rounded-full px-1.5 text-xs text-muted hover:text-ink"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages Container with scroll prevention */}
          <div
            ref={bodyRef}
            role="log"
            aria-label="Conversation with Abhishek's assistant"
            aria-relevant="additions text"
            tabIndex={0}
            className="h-[300px] overflow-y-auto p-4 space-y-3 overscroll-contain focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.role === "user"
                      ? "chat-bubble-user rounded-br-sm shadow-sm"
                      : "chat-bubble-bot rounded-bl-sm shadow-sm"
                  }`}
                >
                  {formatAiResponse(message.text)}
                </div>
              </div>
            ))}

            {/* Thinking / Loading indicator */}
            {sending && (
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-panel2 px-3.5 py-2.5 w-fit">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-purple animate-bounce" />
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-purple animate-bounce [animation-delay:0.15s]" />
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-purple animate-bounce [animation-delay:0.3s]" />
                <span className="text-xs text-muted ml-1">Analyzing verified knowledge...</span>
              </div>
            )}

            {/* Quick suggested prompts when messages <= 2 */}
            {messages.length <= 2 && !sending && (
              <div className="pt-2" aria-live="off">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                  Suggested queries:
                </span>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendQuery(q)}
                      className="text-left rounded-xl border border-line bg-panel2/80 px-3 py-1.5 text-xs text-ink/80 hover:border-purple/50 hover:bg-purple/10 hover:text-ink transition"
                    >
                      &ldquo;{q}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Offline quick links */}
            {offline && (
              <div className="pt-2 border-t border-line/60 mt-3">
                <span className="text-xs text-muted block mb-1.5 font-medium">
                  Direct verified portfolio links:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setOpen(false);
                        if (link.href === "/resume.pdf") trackEvent("resume_download");
                      }}
                      className="rounded-full border border-purple/30 bg-purple/10 px-2.5 py-1 text-xs font-semibold text-purple hover:bg-purple/20 transition"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center border-t border-line bg-panel2 p-2.5 gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, education..."
              aria-label="Ask about projects, skills, education"
              autoComplete="off"
              maxLength={400}
              disabled={sending}
              className="flex-1 rounded-xl border border-line bg-panel px-3 py-2 text-xs text-ink placeholder:text-muted/60 outline-none focus:border-purple focus:ring-1 focus:ring-purple transition disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple text-white transition hover:brightness-110 active:scale-95 disabled:opacity-40"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 8L2 2L4.5 8L2 14L14 8Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}