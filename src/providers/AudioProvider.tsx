"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

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
  const [isOn, setIsOn] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("sound") === "on" : false));
  const [volume, _setVolume] = useState<number>(() => {
    if (typeof window === "undefined") return 0.4;
    const v = Number(localStorage.getItem("volume") ?? 0.4);
    return Number.isFinite(v) ? v : 0.4;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio("/audio/abstract_technology.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onUserGesture = async () => {
      if (!ctxRef.current) {
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.value = volume;
        source.connect(gain).connect(ctx.destination);
        ctxRef.current = ctx;
        gainRef.current = gain;
      }
      setReady(true);
      if (isOn) {
        try {
          await audio.play();
        } catch {}
      }
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
      window.removeEventListener("scroll", onUserGesture);
    };

    window.addEventListener("pointerdown", onUserGesture);
    window.addEventListener("keydown", onUserGesture);
    window.addEventListener("scroll", onUserGesture);

    return () => {
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
      window.removeEventListener("scroll", onUserGesture);
      audio.pause();
    };
  }, [isOn, volume]);

  const fadeTo = useCallback((target: number) => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(target, ctx.currentTime, 0.2);
    if (target === 0) setTimeout(() => audioRef.current?.pause(), 280);
  }, []);

  // Toggle sound
  const toggle = useCallback(() => setIsOn((v) => !v), []);
  const setOn = useCallback((v: boolean) => setIsOn(v), []);

  // Persist + control playback
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("sound", isOn ? "on" : "off");
    const audio = audioRef.current;
    if (!audio) return;
    if (isOn) {
      audio.play().catch(() => {});
      fadeTo(volume);
    } else {
      fadeTo(0);
    }
  }, [isOn, volume, fadeTo]);

  const setVolume = useCallback((n: number) => {
    _setVolume(n);
    if (typeof window !== "undefined") localStorage.setItem("volume", String(n));
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;
    gain.gain.setTargetAtTime(n, ctx.currentTime, 0.1);
  }, []);

  return <Ctx.Provider value={{ ready, isOn, toggle, setOn, volume, setVolume }}>{children}</Ctx.Provider>;
}

export function useAudio() {
  return useContext(Ctx);
}
