"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Background audio using a single HTMLAudioElement + WebAudio GainNode.
 * - Creates audio/context exactly once after a user gesture (autoplay policy).
 * - Volume updates ramp the GainNode (no restart/pops).
 * - Mute/unmute uses a short fade.
 * - State persisted to localStorage.
 */

type AudioCtx = {
  ready: boolean;
  isOn: boolean;
  toggle: () => void;
  setOn: (v: boolean) => void;
  volume: number;
  setVolume: (n: number) => void;
};

const Ctx = createContext<AudioCtx>({
  ready: false,
  isOn: false,
  toggle: () => {},
  setOn: () => {},
  volume: 0.4,
  setVolume: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [ready, setReady] = useState(false);

  const [isOn, setIsOn] = useState<boolean>(() => {
    // Always default to ON, regardless of previous session
    return true;
  });

  const [volume, _setVolume] = useState<number>(() => {
    if (typeof window === "undefined") return 0.4;
    const v = Number(localStorage.getItem("volume") ?? 0.4);
    return Number.isFinite(v) ? v : 0.4;
  });

  // Create the audio element once (not on every re-render)
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return;
    const audio = new Audio("/audio/abstract_technology.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    // Start at 2 seconds to skip the first 2 seconds
    audio.currentTime = 2;

    // When the audio loops, restart at 2 seconds instead of 0
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime < 2) {
        audio.currentTime = 2;
      }
    });

    audioRef.current = audio;
  }, []);

  // One-time setup of AudioContext/GainNode after first user gesture
  useEffect(() => {
    if (typeof window === "undefined") return;
    ensureAudio();

    const onUserGesture = async () => {
      if (!ctxRef.current) {
        const AC: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        const src = ctx.createMediaElementSource(audioRef.current!);
        const gain = ctx.createGain();
        gain.gain.value = volume;
        src.connect(gain).connect(ctx.destination);
        ctxRef.current = ctx;
        gainRef.current = gain;
        setReady(true);
      }
      // Always try to play on first gesture
      try {
        await audioRef.current!.play();
      } catch {}
    };

    // Listen to multiple event types to catch ANY user interaction
    const events = ["click", "pointerdown", "mousedown", "touchstart", "keydown", "scroll", "mousemove", "wheel"];
    events.forEach((event) => {
      window.addEventListener(event, onUserGesture, { once: true, passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, onUserGesture);
      });
      audioRef.current?.pause();
    };
  }, [ensureAudio, volume]);

  // Helper: ramp gain smoothly
  const rampGain = useCallback((target: number, time = 0.12) => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + time);
    if (target === 0) {
      // Pause a beat after fade-out to avoid CPU usage
      setTimeout(() => audioRef.current?.pause(), time * 1000 + 80);
    }
  }, []);

  // Toggle mute (fade, do NOT recreate anything)
  const toggle = useCallback(() => setIsOn((v) => !v), []);
  const setOn = useCallback((v: boolean) => setIsOn(v), []);

  // Persist and play/pause with fade
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't persist sound state - always default to ON on page load
    const audio = audioRef.current;
    if (!audio) return;

    if (isOn) {
      audio.play().catch(() => {});
      rampGain(volume);
    } else {
      rampGain(0);
    }
  }, [isOn, volume, rampGain]);

  // External volume setter (no restarting)
  const setVolume = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(1, n));
      _setVolume(clamped);
      if (typeof window !== "undefined") {
        localStorage.setItem("volume", String(clamped));
      }
      // If audio graph exists, ramp to new volume
      const ctx = ctxRef.current;
      const gain = gainRef.current;
      if (ctx && gain && isOn) {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(clamped, now + 0.08);
      }
    },
    [isOn]
  );

  return <Ctx.Provider value={{ ready, isOn, toggle, setOn, volume, setVolume }}>{children}</Ctx.Provider>;
}

export function useAudio() {
  return useContext(Ctx);
}
