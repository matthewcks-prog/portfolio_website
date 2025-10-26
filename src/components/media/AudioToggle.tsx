"use client";

import { useAudio } from "@/providers/AudioProvider";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AudioToggle({ className }: { className?: string }) {
  const { isOn, toggle, volume, setVolume, ready } = useAudio();

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 glass flex items-center gap-2 border p-2",
        "backdrop-blur supports-[backdrop-filter]:bg-black/30",
        className
      )}
      role="region"
      aria-label="Background audio controls"
    >
      <button
        className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full"
        onClick={toggle}
        aria-label={isOn ? "Mute background audio" : "Unmute background audio"}
        title={isOn ? "Mute" : "Unmute"}
      >
        {isOn ? <Volume2 className="h-5 w-5 text-cyan" /> : <VolumeX className="h-5 w-5 text-muted" />}
      </button>
      <input
        aria-label="Volume"
        className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/20 accent-cyan"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
      />
      {!ready && <span className="select-none text-xs text-muted">click to enable</span>}
    </div>
  );
}
