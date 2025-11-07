"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamic import for PassingClouds
const PassingClouds = dynamic(() => import("@/components/effects/PassingClouds"), {
  ssr: false,
  loading: () => null,
});

// Dynamic import for TwinklingStars
const TwinklingStars = dynamic(() => import("@/components/effects/TwinklingStars"), {
  ssr: false,
  loading: () => null,
});

const BIO =
  "I am a results-oriented Software Engineering student at Monash University with a passion for building practical, innovative solutions. My experience ranges from developing full-stack web applications and autonomous vehicle systems with ROS2 to hands-on cybersecurity analysis during my internship at Ernst & Young. I thrive on challenging problems and am eager to apply my skills in software development, data visualization, and engineering to create impactful technology.";

const TOKENS = [
  "Python",
  "Java",
  "JavaScript",
  "Angular",
  "Node.js",
  "MongoDB",
  "Django",
  "ROS2",
  "SQL",
  "Tableau",
  "Docker",
  "Git",
  "Linux",
  "MATLAB",
  "C/C++",
  "Cybersecurity",
  "Agile/Scrum",
];

export default function AboutMeTerminal() {
  const reduce = useReducedMotion();
  const prompt = useTypewriter("> about matthew --brief", 28, !reduce);
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-20 lg:pt-24 pb-0"
    >
      {/* Background Image - Full Width */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <Image src="/images/background_first.jpg" alt="Background" fill className="object-cover" priority />
        {/* Glassy transparent overlay */}
        <div className="absolute inset-0 backdrop-blur-[3px] bg-gradient-to-b from-black/20 via-black/15 to-black/30" />
      </div>

      {/* Twinkling Stars Effect */}
      <TwinklingStars />

      {/* Passing Clouds Effect */}
      <PassingClouds />

      {/* Content Container - Improved padding and spacing */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid items-center gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-[minmax(0,420px),1fr]">
          {/* Portrait card - Enhanced for better UX */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative group w-full max-w-[420px] mx-auto lg:mx-0"
          >
            {/* Halo glow */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[24px] bg-[conic-gradient(at_50%_40%,rgba(34,211,238,.3),rgba(99,102,241,.25),transparent_45%)] blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Portrait card with hover effects */}
            <motion.div
              className="glass overflow-hidden rounded-3xl transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-[0_25px_70px_rgba(34,211,238,0.2)]"
              whileHover={!reduce ? { rotateX: 1, rotateY: -1 } : undefined}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative aspect-[4/5] w-full bg-surface">
                <Image
                  src="/images/me.jpeg"
                  alt="Matthew, Software Engineer"
                  width={420}
                  height={525}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 420px, 100vw"
                  priority
                />

                {/* Duotone tint overlay (cyan/indigo AI brand) */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan/[0.08] via-indigo/[0.06] to-violet/[0.08] mix-blend-overlay" />

                {/* Soft sheen for premium polish */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.06),transparent_30%,transparent_70%,rgba(255,255,255,.06))]" />
              </div>

              {/* Status bar - Enhanced visual feedback */}
              <div className="flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse shadow-lg shadow-success/50" />
                  <span className="text-white/80 font-medium tracking-wide">AVAILABLE</span>
                </div>
                <div className="text-xs text-white/60 hidden sm:block">Software Engineer</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Terminal block - Improved animations and structure */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-w-0"
          >
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2"
            >
              Matthew Chung Kai Shing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-lg sm:text-xl text-cyan/80 font-medium mb-8"
            >
              Monash University
            </motion.p>

            {/* Glass terminal - Better hierarchy and readability */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 overflow-hidden rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md shadow-glass max-w-2xl"
            >
              {" "}
              {/* Title bar - Improved visual design */}
              <div className="flex items-center justify-between border-b border-white/20 px-4 py-3 flex-wrap gap-2 bg-black/20">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-[#ef4444] shadow-sm" />
                  <span className="inline-block h-3 w-3 rounded-full bg-[#f59e0b] shadow-sm" />
                  <span className="inline-block h-3 w-3 rounded-full bg-[#34d399] shadow-sm" />
                </div>
                <CopyButton text={BIO} />
              </div>
              {/* Prompt + output - Better spacing */}
              <div className="px-5 py-5 text-sm overflow-x-auto">
                <div className="font-mono text-[14px] text-white break-all">
                  <span className="text-cyan">{prompt}</span>
                  {!reduce && <span className="caret text-cyan" aria-hidden="true" />}
                </div>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-7 text-white/90 break-words">{BIO}</p>
              </div>
              {/* Token marquee - Enhanced interaction */}
              <div
                className="relative select-none overflow-hidden border-t border-white/20 bg-black/30 py-3.5"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                role="region"
                aria-label="Technology skills"
              >
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/40 to-transparent" />
                <div
                  className={cn(
                    "flex w-[200%] gap-4 whitespace-nowrap will-change-transform",
                    !reduce && "token-marquee",
                    paused && "paused"
                  )}
                  style={{ ["--marquee-duration" as any]: "22s" }}
                  aria-hidden="true"
                >
                  {[...TOKENS, ...TOKENS].map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-100 hover:bg-white/20 transition-colors duration-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* CTAs & socials - Improved button design and accessibility */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                className="focus-ring inline-flex items-center gap-2 rounded-xl bg-indigo/90 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo/30"
                href="/resume.pdf"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Résumé
              </a>
              <a
                className="focus-ring inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10 hover:border-cyan/40 transition-all"
                href="#projects"
              >
                View Projects
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              {/* Social links with better spacing */}
              <div className="flex items-center gap-2 ml-auto">
                <a
                  aria-label="LinkedIn Profile"
                  className="focus-ring rounded-full border border-white/20 p-2.5 hover:bg-cyan/10 hover:border-cyan/40 transition-all group"
                  href="#"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Linkedin className="h-4 w-4 text-cyan group-hover:scale-110 transition-transform" />
                </a>
                <a
                  aria-label="GitHub Profile"
                  className="focus-ring rounded-full border border-white/20 p-2.5 hover:bg-cyan/10 hover:border-cyan/40 transition-all group"
                  href="#"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Github className="h-4 w-4 text-cyan group-hover:scale-110 transition-transform" />
                </a>
                <a
                  aria-label="Email Contact"
                  className="focus-ring rounded-full border border-white/20 p-2.5 hover:bg-cyan/10 hover:border-cyan/40 transition-all group"
                  href="mailto:hello@example.com"
                >
                  <Mail className="h-4 w-4 text-cyan group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
