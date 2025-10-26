"use client";

import HeroVideo from "@/components/media/HeroVideo";
import ImmersiveVideoSection from "@/components/media/ImmersiveVideoSection";
import GlassCard from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

export default function HomePage() {
  const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } };

  return (
    <>
      <HeroVideo />

      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16">
        <motion.h2 {...fadeIn} className="mb-6 text-xl font-medium text-muted">
          Selected Projects
        </motion.h2>
        <div id="projects" className="grid gap-6 md:grid-cols-3">
          {["Realtime Dashboard", "3D Configurator", "CI/CD Accelerator"].map((t, i) => (
            <motion.div key={t} {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.06 * i }}>
              <GlassCard className="p-5">
                <h3 className="text-lg font-medium">{t}</h3>
                <p className="mt-2 text-sm text-muted">Outcome-focused summary. Include metrics.</p>
                <div className="mt-4 text-xs text-cyan">TypeScript · Next.js · R3F</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <ImmersiveVideoSection />
    </>
  );
}
