"use client";

import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/providers/AudioProvider";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SoundControl({ className }: { className?: string }) {
  const { isOn, toggle, volume, setVolume, ready } = useAudio();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* round toggle */}
      <button
        onClick={toggle}
        onMouseEnter={() => setOpen(true)}
        className={cn(
          "focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
          isOn ? "bg-[#1f2430] text-cyan" : "bg-white/70 text-[#333]"
        )}
        aria-label={isOn ? "Mute background audio" : "Unmute background audio"}
        title={isOn ? "Mute" : "Unmute"}
      >
        {isOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>

      {/* slide-out volume panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 z-50 glass flex items-center gap-3 border p-3"
            onMouseLeave={() => setOpen(false)}
            role="region"
            aria-label="Volume control"
          >
            <span className="text-xs text-muted">{ready ? "Volume" : "interact to start audio"}</span>
            <input
              aria-label="Volume"
              className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-white/20 accent-cyan"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
