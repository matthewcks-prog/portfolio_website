"use client";

import ImmersiveVideoSection from "@/components/media/ImmersiveVideoSection";
import GlassCard from "@/components/ui/GlassCard";
import SpaceHero from "@/app/components/SpaceHero";
import AboutMeTerminal from "@/components/sections/AboutMeTerminal";
import { motion } from "framer-motion";

export default function HomePage() {
  const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } };

  return (
    <>
      <AboutMeTerminal />

      {/* Space Hero Section - 3D Earth & Astronaut with Warp Effect */}
      <section id="space-experience" className="relative h-screen overflow-hidden bg-black">
        <SpaceHero />
      </section>

      <section id="projects" className="h-screen flex items-center justify-center bg-gradient-to-b from-[#2a4a6a] to-[#1a3a52]">
        <div className="mx-auto max-w-6xl px-6 w-full">
          <motion.h2 {...fadeIn} className="mb-6 text-3xl font-semibold">
            Selected Projects
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
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
        </div>
      </section>

      <section id="skills" className="h-screen flex items-center justify-center bg-gradient-to-b from-[#1a3a52] to-[#0a2540]">
        <div className="mx-auto max-w-6xl px-6 w-full">
          <motion.h2 {...fadeIn} className="mb-6 text-3xl font-semibold">
            Technical Skills
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            {["Frontend Development", "3D Graphics & Animation", "Backend & APIs", "DevOps & Cloud"].map((skill, i) => (
              <motion.div key={skill} {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.06 * i }}>
                <GlassCard className="p-6">
                  <h3 className="font-medium text-cyan">{skill}</h3>
                  <p className="mt-2 text-sm text-muted">Add your specific technologies and experience here.</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="highlights" className="h-screen flex items-center justify-center bg-gradient-to-b from-[#0a2540] to-[#1a3a52]">
        <div className="mx-auto max-w-6xl px-6 w-full">
          <ImmersiveVideoSection />
        </div>
      </section>

      <section id="hobbies" className="h-screen flex items-center justify-center bg-gradient-to-b from-[#1a3a52] to-[#2a4a6a]">
        <div className="mx-auto max-w-6xl px-6 w-full">
          <motion.h2 {...fadeIn} className="mb-6 text-3xl font-semibold">
            Beyond Code
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {["Photography", "Music Production", "Gaming"].map((hobby, i) => (
              <motion.div key={hobby} {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.06 * i }}>
                <GlassCard className="p-5">
                  <h3 className="text-lg font-medium">{hobby}</h3>
                  <p className="mt-2 text-sm text-muted">Share your interests and passions outside of work.</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="h-screen flex items-center justify-center bg-gradient-to-b from-[#2a4a6a] to-[#0a1929]">
        <div className="mx-auto max-w-6xl px-6 w-full">
          <motion.h2 {...fadeIn} className="mb-6 text-3xl font-semibold">
            Get In Touch
          </motion.h2>
          <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }}>
            <GlassCard className="p-8">
              <p className="text-lg text-muted mb-6">Have a project in mind? Let&apos;s talk about how we can work together.</p>
              <div className="flex gap-4">
                <a
                  href="mailto:hello@example.com"
                  className="focus-ring rounded-xl bg-cyan/90 px-6 py-3 font-semibold text-black hover:bg-cyan transition-colors"
                >
                  Email Me
                </a>
                <a
                  href="#"
                  className="focus-ring rounded-xl border border-white/10 px-6 py-3 font-semibold hover:bg-white/5 transition-colors"
                >
                  View Resume
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </>
  );
}
