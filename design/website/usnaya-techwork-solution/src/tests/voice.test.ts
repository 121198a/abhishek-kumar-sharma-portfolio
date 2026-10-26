import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { START_TIMEOUT_MS, VoiceManager } from "../engine/VoiceManager";
import { useSettings } from "../store/settingsStore";

/** A scriptable stand-in for the browser's speech engine. It is the only fake: the VoiceManager logic under test is real. */
class FakeSynth {
  voices: Array<{ name: string; lang: string }> = [{ name: "Test Voice", lang: "en-IN" }];
  spoken: FakeUtterance[] = [];
  paused = false;
  onvoiceschanged: (() => void) | null = null;
  getVoices() {
    return this.voices;
  }
  speak(u: FakeUtterance) {
    this.spoken.push(u);
  }
  cancel() {
    const u = this.spoken.pop();
    this.spoken = [];
    u?.onerror?.({ error: "interrupted" });
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }
}
type FakeUtterance = {
  text: string;
  voice?: unknown;
  rate: number;
  pitch: number;
  volume: number;
  onstart?: () => void;
  onend?: () => void;
  onerror?: (e: { error: string }) => void;
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(public text: string) {}
      rate = 1;
      pitch = 1;
      volume = 1;
    },
  );
  useSettings.setState({ muted: false, volume: 0.6 });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const make = () => {
  const synth = new FakeSynth();
  return { synth, vm: new VoiceManager(synth as unknown as SpeechSynthesis) };
};

describe("voice playback", () => {
  it("reports unsupported browsers and never throws", () => {
    const vm = new VoiceManager(null);
    expect(vm.status).toBe("unsupported");
    expect(vm.isSupported()).toBe(false);
    expect(() => {
      vm.speak("hello");
      vm.pause();
      vm.stop();
    }).not.toThrow();
  });

  it("plays: loading, speaking, idle", () => {
    const { synth, vm } = make();
    const seen: string[] = [];
    vm.subscribeStatus((s) => seen.push(s));
    vm.speak("Hello there");
    expect(vm.status).toBe("loading");
    synth.spoken[0]?.onstart?.();
    expect(vm.status).toBe("speaking");
    expect(vm.isSpeaking).toBe(true);
    synth.spoken[0]?.onend?.();
    expect(vm.status).toBe("idle");
    expect(vm.isSpeaking).toBe(false);
    expect(seen).toEqual(["loading", "speaking", "idle"]);
  });

  it("pauses and resumes only while speaking", () => {
    const { synth, vm } = make();
    vm.pause();
    expect(synth.paused).toBe(false);
    vm.speak("Hello");
    synth.spoken[0]?.onstart?.();
    vm.pause();
    expect(vm.status).toBe("paused");
    expect(vm.isSpeaking).toBe(false);
    vm.resume();
    expect(vm.status).toBe("speaking");
    vm.stop();
    expect(vm.status).toBe("idle");
  });

  it("flags blocked audio when the browser never starts the utterance", () => {
    const { vm } = make();
    vm.speak("Hello");
    vi.advanceTimersByTime(START_TIMEOUT_MS + 10);
    expect(vm.status).toBe("blocked");
    expect(vm.isSpeaking).toBe(false);
  });

  it("maps not-allowed to blocked and other failures to error", () => {
    const a = make();
    a.vm.speak("Hello");
    a.synth.spoken[0]?.onerror?.({ error: "not-allowed" });
    expect(a.vm.status).toBe("blocked");
    const b = make();
    b.vm.speak("Hello");
    b.synth.spoken[0]?.onerror?.({ error: "synthesis-failed" });
    expect(b.vm.status).toBe("error");
  });

  it("a new reply replaces the old one and stale events are ignored", () => {
    const { synth, vm } = make();
    vm.speak("first");
    const first = synth.spoken[0];
    vm.speak("second");
    expect(synth.spoken).toHaveLength(1);
    first?.onend?.(); // late event from the replaced utterance
    expect(vm.status).toBe("loading");
    synth.spoken[0]?.onstart?.();
    expect(vm.status).toBe("speaking");
  });

  it("stop (closing the conversation or switching character) silences immediately and cancels the watchdog", () => {
    const { vm } = make();
    vm.speak("Hello");
    vm.stop();
    vi.advanceTimersByTime(START_TIMEOUT_MS * 2);
    expect(vm.status).toBe("idle");
  });

  it("respects the sound-off preference: nothing is spoken", () => {
    const { synth, vm } = make();
    useSettings.setState({ muted: true });
    vm.speak("Hello");
    expect(synth.spoken).toHaveLength(0);
    expect(vm.status).toBe("idle");
    useSettings.setState({ muted: false, volume: 0 });
    vm.speak("Hello");
    expect(synth.spoken).toHaveLength(0);
  });
});
