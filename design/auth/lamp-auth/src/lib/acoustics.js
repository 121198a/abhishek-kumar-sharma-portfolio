// Procedural sounds via Web Audio (no audio assets). The context is created lazily,
// on the first sound, which always follows a user gesture.
class Acoustics {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  context() {
    if (!this.ctx && typeof window !== 'undefined') {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone({ type = 'sine', from, to, gain, start = 0, dur }) {
    if (this.muted) return;
    try {
      const ctx = this.context();
      if (!ctx) return;
      const t = ctx.currentTime + start;
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, t);
      if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
      amp.gain.setValueAtTime(gain, t);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch (e) {
      /* audio is optional */
    }
  }

  cordPull() {
    this.tone({ type: 'triangle', from: 620, to: 140, gain: 0.12, dur: 0.09 });
    this.tone({ from: 440, to: 880, gain: 0.06, start: 0.04, dur: 0.28 });
  }

  alertDim() {
    this.tone({ type: 'sawtooth', from: 180, to: 95, gain: 0.05, dur: 0.28 });
  }

  tick(pitch = 950) {
    this.tone({ from: pitch, gain: 0.03, dur: 0.04 });
  }

  successArpeggio() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone({ from: f, gain: 0.04, start: i * 0.11, dur: 0.12 }));
  }
}

export const audio = new Acoustics();
