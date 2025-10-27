"use client";
import { useEffect, useState } from "react";
export function useTypewriter(text: string, speed = 35, enabled = true) {
  const [out, setOut] = useState(enabled ? "" : text);
  useEffect(() => {
    if (!enabled) return setOut(text);
    let i = 0,
      alive = true;
    const tick = () => {
      if (!alive) return;
      i++;
      setOut(text.slice(0, i));
      if (i < text.length) setTimeout(tick, speed);
    };
    tick();
    return () => {
      alive = false;
    };
  }, [text, speed, enabled]);
  return out;
}
