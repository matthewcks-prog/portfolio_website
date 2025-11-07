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
    audio.volume = 1.0; // Set audio element volume to max, we'll control via GainNode

    // When the audio loops, restart at 3 seconds instead of 0
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime > 0 && audio.currentTime < 3) {
        audio.currentTime = 3;
      }
    });

    // Add event listeners for debugging
    audio.addEventListener("loadeddata", () => console.log("Audio loaded successfully"));
    audio.addEventListener("error", (e) => console.error("Audio error:", e));
    audio.addEventListener("play", () => console.log("Audio play event fired"));
    audio.addEventListener("playing", () => console.log("Audio is now playing"));

    console.log("Audio element created:", audio.src);
    audioRef.current = audio;
  }, []);

  // One-time setup of AudioContext/GainNode after first user gesture
  useEffect(() => {
    if (typeof window === "undefined") return;
    ensureAudio();

    const onUserGesture = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      // Create AudioContext + graph once
      if (!ctxRef.current) {
        const AC: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        const src = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        const currentVolume = Number(localStorage.getItem("volume") ?? 0.4);
        gain.gain.value = currentVolume;
        src.connect(gain).connect(ctx.destination);
        ctxRef.current = ctx;
        gainRef.current = gain;
        setReady(true);
      }

      // Resume context if suspended
      if (ctxRef.current?.state === "suspended") {
        try {
          await ctxRef.current.resume();
        } catch (e) {
          console.warn("AudioContext resume failed:", e);
        }
      }

      // Attempt to start playback during the gesture
      try {
        if (audio.currentTime === 0) {
          audio.currentTime = 3;
        }
        if (audio.paused) {
          await audio.play();
        }
      } catch (e) {
        // If play fails (policy), keep listeners to try again on next gesture
        console.warn("Audio play during gesture failed:", e);
        return;
      }

      // Success: remove listeners once we have started or confirmed playback
      events.forEach((event) => {
        window.removeEventListener(event, onUserGesture);
        document.removeEventListener(event, onUserGesture);
      });
    };

    // Listen to multiple event types to catch ANY user interaction
    // Add listeners to both window and document to catch more events
    const events = [
      "click",
      "mousedown",
      "mouseup",
      "mousemove",
      "mouseover",
      "mouseenter",
      "pointerdown",
      "pointerup",
      "pointermove",
      "pointerover",
      "touchstart",
      "touchmove",
      "touchend",
      "keydown",
      "keyup",
      "keypress",
      "scroll",
      "wheel",
      "focus",
      "focusin",
    ];

    events.forEach((event) => {
      window.addEventListener(event, onUserGesture, { once: true, passive: true, capture: true });
      document.addEventListener(event, onUserGesture, { once: true, passive: true, capture: true });
    });

    // Lifecycle: attempt resume when tab becomes visible or page is shown (iOS)
    const onVisibility = async () => {
      const audio = audioRef.current;
      const ctx = ctxRef.current;
      if (!audio || !ctx) return;
      try {
        if (ctx.state === "suspended") await ctx.resume();
        if (!audio.paused && audio.readyState >= 2) return;
        if (isOn) {
          if (audio.currentTime === 0) audio.currentTime = 3;
          await audio.play().catch(() => {});
        }
      } catch (e) {
        // noop
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onVisibility);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, onUserGesture);
        document.removeEventListener(event, onUserGesture);
      });
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onVisibility);
      audioRef.current?.pause();
    };
  }, [ensureAudio, isOn]);

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

  // When audio context becomes ready, set initial volume
  useEffect(() => {
    if (!ready || !gainRef.current) return;
    const gain = gainRef.current;
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Set initial volume immediately when ready
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    console.log("Initial volume set to:", volume);
  }, [ready, volume]);

  // Persist and play/pause with fade
  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = audioRef.current;
    const gain = gainRef.current;

    // Don't do anything until audio context is ready
    if (!audio || !gain || !ready) {
      console.log("Not ready yet:", { audio: !!audio, gain: !!gain, ready });
      return;
    }

    console.log("Play/pause effect triggered:", { isOn, isPaused: audio.paused, currentTime: audio.currentTime });

    if (isOn) {
      // Set start time to 3 seconds if not already playing and at beginning
      if (audio.paused && audio.currentTime === 0) {
        console.log("Setting audio start time to 3 seconds");
        audio.currentTime = 3;
      }

      // Only call play if paused
      if (audio.paused) {
        console.log("Calling audio.play()");
        audio.play().catch((e) => console.warn("Audio play failed:", e));
      } else {
        console.log("Audio already playing, not calling play again");
      }
    } else {
      rampGain(0);
      console.log("Audio muted");
    }
  }, [isOn, ready, rampGain]);

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
