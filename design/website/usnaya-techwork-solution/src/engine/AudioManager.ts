import { useSettings } from "../store/settingsStore";

/**
 * Synthesised sound effects (no audio files, so no licensing questions).
 * The AudioContext is created only after the first user gesture because of browser autoplay rules.
 */
type Sfx = "knock" | "step" | "ui" | "door" | "arrive" | "message";

class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambience: { stop: () => void } | null = null;

  /** Call from a click/key handler. Safe to call repeatedly. */
  unlock() {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        this.applySettings();
        this.startAmbience();
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
    } catch (e) {
      console.warn("[audio] unavailable", e);
    }
  }

  applySettings() {
    if (!this.master) return;
    const { volume, muted } = useSettings.getState();
    this.master.gain.value = muted ? 0 : volume * 0.5;
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number, when = 0, slideTo?: number) {
    if (!this.ctx || !this.master) return;
    const t0 = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.master);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  play(name: Sfx) {
    if (!this.ctx) return;
    switch (name) {
      case "knock":
        this.tone(160, 0.09, "triangle", 0.9, 0, 90);
        this.tone(150, 0.09, "triangle", 0.9, 0.2, 85);
        this.tone(165, 0.1, "triangle", 0.9, 0.4, 90);
        break;
      case "step":
        this.tone(95 + Math.random() * 20, 0.05, "square", 0.05, 0, 60);
        break;
      case "ui":
        this.tone(620, 0.05, "sine", 0.12);
        break;
      case "message":
        this.tone(520, 0.08, "sine", 0.1);
        this.tone(780, 0.1, "sine", 0.08, 0.07);
        break;
      case "door":
        this.tone(110, 0.9, "sawtooth", 0.05, 0, 190);
        break;
      case "arrive":
        this.tone(440, 0.18, "sine", 0.12);
        this.tone(660, 0.28, "sine", 0.1, 0.12);
        break;
    }
  }

  private startAmbience() {
    if (!this.ctx || !this.master) return;
    // very quiet filtered-noise room tone
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 380;
    const g = this.ctx.createGain();
    g.gain.value = 0.035;
    src.connect(f).connect(g).connect(this.master);
    src.start();
    this.ambience = { stop: () => src.stop() };
  }

  dispose() {
    this.ambience?.stop();
    void this.ctx?.close();
    this.ctx = null;
  }
}

export const audio = new AudioManager();
useSettings.subscribe(() => audio.applySettings());
