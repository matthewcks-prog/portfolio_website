"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
      {!reduce ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/hero.mp4"
          playsInline
          muted
          loop
          preload="auto"
          aria-label="Hero background video"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,.15),transparent_60%)]" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,15,26,.0),rgba(10,15,26,.65)_70%)]" />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Building reliable, human-friendly software with AI-grade polish.</h1>
          <p className="mt-3 text-muted">Systems, performance, and delightful interactions — showcased with 3D and motion.</p>
          <div className="mt-6 flex gap-3">
            <a href="#projects" className="focus-ring rounded-xl bg-indigo/90 px-4 py-2 text-sm text-white hover:bg-indigo">
              View Projects
            </a>
            <a href="/resume.pdf" className="focus-ring rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
              Download Résumé
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
