"use client";

import { Pause, Play } from "lucide-react";
import { useMotionPreference } from "@/components/providers/MotionPreferenceProvider";

export default function MotionToggle() {
  const { motionEnabled, ready, toggleMotion } = useMotionPreference();

  return (
    <button
      type="button"
      onClick={toggleMotion}
      disabled={!ready}
      aria-label="Hero and marquee motion"
      aria-pressed={motionEnabled}
      title={motionEnabled ? "Reduce Hero and marquee motion" : "Enable Hero and marquee motion"}
      className="btn-icon h-9 w-9"
    >
      {motionEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </button>
  );
}