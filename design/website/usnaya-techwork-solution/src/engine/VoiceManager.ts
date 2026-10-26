import { useSettings } from "../store/settingsStore";
import { characterById } from "../data/characters";

type SpeechStateListener = (speaking: boolean) => void;

/** idle: nothing playing. loading: queued, waiting for the browser to start. speaking/paused: playing.
 *  blocked: the browser never started playback (autoplay policy, no voices, muted OS). error: the engine reported a failure. */
export type VoiceStatus = "unsupported" | "idle" | "loading" | "speaking" | "paused" | "blocked" | "error";
type StatusListener = (status: VoiceStatus) => void;

/** How long the browser gets to start an utterance before we call it blocked and fall back to text. */
export const START_TIMEOUT_MS = 2500;

export class VoiceManager {
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners = new Set<SpeechStateListener>();
  private statusListeners = new Set<StatusListener>();
  private watchdog: ReturnType<typeof setTimeout> | null = null;
  public isSpeaking = false;
  public status: VoiceStatus;

  constructor(private synth: SpeechSynthesis | null = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null) {
    this.status = synth ? "idle" : "unsupported";
    if (synth) {
      this.loadVoices();
      synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synth?.getVoices() ?? [];
  }

  public subscribe(fn: SpeechStateListener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public subscribeStatus(fn: StatusListener) {
    this.statusListeners.add(fn);
    return () => this.statusListeners.delete(fn);
  }

  private setStatus(status: VoiceStatus) {
    if (this.status === status) return;
    this.status = status;
    this.statusListeners.forEach((fn) => fn(status));
    const speaking = status === "speaking";
    if (this.isSpeaking !== speaking) {
      this.isSpeaking = speaking;
      this.listeners.forEach((fn) => fn(speaking));
    }
  }

  private clearWatchdog() {
    if (this.watchdog) clearTimeout(this.watchdog);
    this.watchdog = null;
  }

  private selectVoice(characterId?: string): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.loadVoices();
    const english = this.voices.filter((v) => v.lang.startsWith("en"));
    const pool = english.length ? english : this.voices;
    if (!pool.length) return null;
    const female = isFemaleVoice(characterId);
    const named = pool.find((v) => (female ? FEMALE_NAMES : MALE_NAMES).test(v.name));
    return named ?? pool[0] ?? null;
  }

  /** Starts reading `text`. Must be called from a user-initiated path for browsers that gate audio on a gesture. */
  public speak(text: string, characterId?: string) {
    if (!this.synth) return;
    const { muted, volume } = useSettings.getState();
    if (muted || volume <= 0) return;
    const clean = text.replace(/[*_#`[\]()]/g, "").trim();
    if (!clean) return;

    this.stop();
    const u = new SpeechSynthesisUtterance(clean);
    this.currentUtterance = u;
    const voice = this.selectVoice(characterId);
    if (voice) u.voice = voice;
    u.rate = 1;
    u.pitch = isFemaleVoice(characterId) ? 1.06 : 0.95;
    u.volume = Math.max(0.1, Math.min(1, volume));

    // Ignore events from an utterance that has since been replaced or stopped.
    const live = () => this.currentUtterance === u;
    u.onstart = () => {
      if (!live()) return;
      this.clearWatchdog();
      this.setStatus("speaking");
    };
    u.onend = () => {
      if (!live()) return;
      this.clearWatchdog();
      this.currentUtterance = null;
      this.setStatus("idle");
    };
    u.onerror = (e) => {
      if (!live()) return;
      this.clearWatchdog();
      this.currentUtterance = null;
      // "interrupted"/"canceled" come from our own stop(); "not-allowed" is the autoplay policy.
      if (e.error === "interrupted" || e.error === "canceled") this.setStatus("idle");
      else this.setStatus(e.error === "not-allowed" ? "blocked" : "error");
    };

    this.setStatus("loading");
    this.watchdog = setTimeout(() => {
      if (live() && this.status === "loading") {
        this.currentUtterance = null;
        try {
          this.synth?.cancel();
        } catch {
          /* ignore */
        }
        this.setStatus("blocked");
      }
    }, START_TIMEOUT_MS);

    try {
      this.synth.speak(u);
    } catch {
      this.clearWatchdog();
      this.currentUtterance = null;
      this.setStatus("error");
    }
  }

  public pause() {
    if (!this.synth || this.status !== "speaking") return;
    this.synth.pause();
    this.setStatus("paused");
  }

  public resume() {
    if (!this.synth || this.status !== "paused") return;
    this.synth.resume();
    this.setStatus("speaking");
  }

  public stop() {
    this.clearWatchdog();
    this.currentUtterance = null;
    try {
      this.synth?.cancel();
    } catch {
      /* ignore */
    }
    if (this.status !== "unsupported") this.setStatus("idle");
  }

  public isSupported(): boolean {
    return this.status !== "unsupported";
  }
}

const FEMALE_NAMES = /female|zira|samantha|victoria|karen|moira|veena|sangeeta|priya|heera/i;
const MALE_NAMES = /\bmale\b|david|george|alex|daniel|rishi|neerja|ravi|prabhat/i;
const isFemaleVoice = (id?: string) => (id ? ["receptionist", "ankita", "assistant"].includes(characterById(id)?.id ?? "") : false);

export const voice = new VoiceManager();
