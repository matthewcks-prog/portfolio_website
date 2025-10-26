"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export default function ImmersiveVideoSection() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [duration, setDuration] = useState(1);

  // Preload metadata, keep video muted & inline for mobile
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => setDuration(v.duration || 1);
    v.addEventListener("loadedmetadata", onLoaded);
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    // kickstart decode pipeline safely (then pause)
    v.play()
      .then(() => v.pause())
      .catch(() => {});
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  // Scrub currentTime based on scroll progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const unsub = scrollYProgress.on("change", (p) => {
      if (!duration) return;
      v.currentTime = p * duration;
    });
    return () => unsub();
  }, [duration, scrollYProgress]);

  // Cosmetic: round corners when entering/leaving the section
  const radius = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [24, 12, 12, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.96, 1, 1, 0.96]);

  return (
    <section ref={containerRef} className="relative h-[240vh]">
      <div className="sticky top-0 h-screen w-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,.06),transparent_60%)]">
        <motion.div className="mx-auto h-full w-full max-w-7xl overflow-hidden shadow-glass" style={{ borderRadius: radius, scale }}>
          {reduce ? (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,.15),transparent_60%)]" />
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/video/scroll_immersive_set_piece.mp4"
              preload="auto"
              playsInline
              muted
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
