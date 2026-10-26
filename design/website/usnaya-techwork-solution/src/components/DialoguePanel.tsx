import { useEffect, useRef, useState } from "react";
import { characterById } from "../data/characters";
import { destinationById } from "../data/destinations";
import { speakerLabel } from "../dialogue/DialogueManager";
import { send } from "../experience/ExperienceDirector";
import { sendMessage } from "../services/ConversationApi";
import { useDialogue, type ChatMessage } from "../store/dialogueStore";
import { audio } from "../engine/AudioManager";
import { voice, type VoiceStatus } from "../engine/VoiceManager";
import { useSettings } from "../store/settingsStore";

const MAX = 300;

export function DialoguePanel() {
  const node = useDialogue((s) => s.node);
  const ai = useDialogue((s) => s.ai);
  const messages = useDialogue((s) => s.messages);
  const { choose, next, setAi, addMessage } = useDialogue.getState();
  
  const [text, setText] = useState("");
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>(voice.status);
  const soundOff = useSettings((s) => s.muted || s.volume <= 0);
  const [lastAsked, setLastAsked] = useState<string>("");
  
  const abortRef = useRef<AbortController | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to speech synthesis state
  useEffect(() => {
    setVoiceStatus(voice.status);
    const unsub = voice.subscribeStatus(setVoiceStatus);
    return () => {
      unsub();
    };
  }, []);

  // On new node or message: auto-scroll to latest
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, ai]);

  // Clean up speech and in-flight requests on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      voice.stop();
    };
  }, []);

  if (!node) return null;
  const who = speakerLabel(node.speakerId);
  const speaker = characterById(node.speakerId);
  const canAsk = Boolean(speaker?.aiEnabled);
  const choices = node.choices ?? [];
  const loading = ai.status === "loading";

  async function ask(messageText: string) {
    const m = messageText.trim();
    if (!m || loading || !speaker) return;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLastAsked(m);

    // Append visitor message to conversation transcript
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "visitor",
      text: m,
      timestamp: timeStr,
    };
    addMessage(userMsg);
    setText("");
    setAi({ status: "loading" });

    const reply = await sendMessage({ characterId: speaker.id, departmentId: speaker.departmentId, message: m }, ctrl.signal);
    if (ctrl.signal.aborted || !reply) return;

    // Append employee response to transcript
    const empMsg: ChatMessage = {
      id: `e-${Date.now()}`,
      sender: "employee",
      text: reply.message,
      timestamp: timeStr,
      error: reply.source === "fallback",
    };
    addMessage(empMsg);

    // Speak aloud if enabled
    voice.speak(reply.message, speaker.id);

    setAi({
      status: reply.source === "fallback" ? "error" : "done",
      text: reply.message,
      suggestedReplies: reply.suggestedReplies,
      action: reply.action,
      source: reply.source,
    });
  }

  const lastReply = messages.filter((m) => m.sender === "employee").pop();
  const readAloud = () => {
    if (lastReply) voice.speak(lastReply.text, speaker?.id);
  };
  const voiceNote =
    soundOff
      ? "Sound is off in Settings. The conversation is shown as text."
      : voiceStatus === "blocked"
        ? "Your browser did not start audio. Press Play to try again, or read the text."
        : voiceStatus === "error"
          ? "Voice playback failed. The text above is the full reply."
          : voiceStatus === "loading"
            ? "Starting voice…"
            : null;

  return (
    <section className="dialogue dialogue--unified" role="dialog" aria-label={`Conversation with ${who.name}`}>
      {/* Header with avatar, role, voice indicator & controls */}
      <header className="dialogue__head">
        <div className="dialogue__identity">
          <span className="dialogue__avatar" aria-hidden="true">
            {who.name.charAt(0)}
          </span>
          <div className="dialogue__titles">
            <span className="dialogue__name">{who.name}</span>
            <span className="dialogue__role">{who.role}</span>
          </div>
        </div>

        <div className="dialogue__tools">
          {voice.isSupported() ? (
            <div className="voice-controls" role="group" aria-label="Voice playback">
              {voiceStatus === "speaking" ? (
                <button className="btn btn--tool btn--speaking" onClick={() => voice.pause()} aria-label="Pause voice">
                  Pause
                </button>
              ) : voiceStatus === "paused" ? (
                <button className="btn btn--tool" onClick={() => voice.resume()} aria-label="Resume voice">
                  Resume
                </button>
              ) : (
                <button className="btn btn--tool" onClick={readAloud} disabled={soundOff || !lastReply || voiceStatus === "loading"} aria-label="Play last reply aloud">
                  Play
                </button>
              )}
              <button className="btn btn--tool" onClick={() => voice.stop()} disabled={voiceStatus === "idle" || voiceStatus === "blocked" || voiceStatus === "error"} aria-label="Stop voice">
                Stop
              </button>
            </div>
          ) : (
            <span className="dialogue__note">Voice isn't supported in this browser. Replies are shown as text.</span>
          )}
          <button
            className="btn btn--quiet dialogue__close"
            onClick={() => {
              voice.stop();
              send({ type: "dialogue:completed" });
            }}
          >
            Close
          </button>
        </div>
      </header>

      {voiceNote && (
        <p className="dialogue__note" role="status">
          {voiceNote}
        </p>
      )}

      {/* Unified chronological message transcript */}
      <div className="dialogue__transcript" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.sender === "visitor"
                ? "chat-bubble chat-bubble--visitor"
                : msg.error
                  ? "chat-bubble chat-bubble--employee chat-bubble--error"
                  : "chat-bubble chat-bubble--employee"
            }
          >
            <p className="chat-bubble__text">{msg.text}</p>
            <span className="chat-bubble__time">{msg.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble chat-bubble--employee chat-bubble--loading">
            <span className="typing-dots">{who.name} is thinking…</span>
          </div>
        )}

        {ai.status === "error" && (
          <div className="chat-error-actions">
            <button className="btn btn--choice btn--retry" onClick={() => void ask(lastAsked || "Hello")}>
              ↺ Retry question
            </button>
          </div>
        )}

        {ai.action && (
          <div className="chat-action-prompt">
            <button
              className="btn btn--primary"
              onClick={() => {
                voice.stop();
                if (ai.action) {
                  send({ type: "destination:selected", destinationId: ai.action.targetId });
                }
              }}
            >
              Take me to {destinationById(ai.action.targetId)?.label ?? "destination"}
            </button>
          </div>
        )}

        <div ref={logEndRef} />
      </div>

      {/* Suggested question chips (authored nodes + follow-up suggestions) */}
      <div className="dialogue__choices">
        {choices.length > 0 ? (
          <ul className={choices.length > 4 ? "choices choices--grid" : "choices"}>
            {choices.map((c) => (
              <li key={c.id}>
                <button
                  className="btn btn--choice"
                  onClick={() => {
                    audio.play("ui");
                    choose(c);
                  }}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="choices">
            <button
              className="btn btn--primary"
              onClick={() => {
                audio.play("ui");
                next();
              }}
            >
              {node.end || !node.nextNodeId ? "Finish conversation" : "Continue"}
            </button>
          </div>
        )}

        {ai.suggestedReplies && ai.suggestedReplies.length > 0 && (
          <ul className="chips" aria-label="Suggested follow-up questions">
            {ai.suggestedReplies.map((r) => (
              <li key={r}>
                <button
                  className="chip"
                  disabled={loading}
                  onClick={() => {
                    audio.play("ui");
                    void ask(r);
                  }}
                >
                  {r}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Custom typed question input form */}
      {canAsk && (
        <form
          className="ask"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(text);
          }}
        >
          <div className="ask__row">
            <input
              id="ask-input"
              className="ask__input"
              value={text}
              maxLength={MAX}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Ask ${who.name} anything about USNAYA…`}
              autoComplete="off"
              disabled={loading}
              aria-label="Type your question"
            />
            <button className="btn btn--primary" type="submit" disabled={loading || text.trim().length === 0}>
              {loading ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
