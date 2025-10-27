"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useState } from "react";
import { cn } from "@/lib/utils";

const BIO =
  "Highly motivated student seeking to become a professional accredited software engineer. Passionate about Mathematics and the Sciences and eager to contribute to innovative solutions to global challenges in the field. Dedicated to learning through challenges.";

const TOKENS = [
  "TypeScript",
  "Next.js",
  "React",
  "Framer Motion",
  "Node",
  "GraphQL",
  "WebGL/R3F",
  "LLM",
  "PromptOps",
  "Edge Runtime",
  "CI/CD",
  "Testing",
  "A11y",
  "Perf Budgets",
  "Clean Architecture",
  "Monorepos",
  "Vercel",
];

export default function AboutMeTerminal() {
  const reduce = useReducedMotion();
  const prompt = useTypewriter("> about matthew --brief", 28, !reduce);
  const [paused, setPaused] = useState(false);

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 overflow-hidden">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,420px),1fr]">
        {/* Portrait card */}
        <div className="relative group w-full max-w-[420px] mx-auto lg:mx-0">
          {/* Halo glow */}
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[24px] bg-[conic-gradient(at_50%_40%,rgba(34,211,238,.25),rgba(99,102,241,.22),transparent_40%)] blur-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Portrait card with hover effects */}
          <motion.div
            className="glass overflow-hidden rounded-3xl transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-[0_20px_60px_rgba(34,211,238,0.15)]"
            whileHover={!reduce ? { rotateX: 2, rotateY: -2 } : undefined}
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
                loading="lazy"
                sizes="(min-width: 1024px) 420px, 100vw"
              />

              {/* Duotone tint overlay (cyan/indigo AI brand) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan/[0.08] via-indigo/[0.06] to-violet/[0.08] mix-blend-overlay" />

              {/* Soft sheen for premium polish */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.06),transparent_30%,transparent_70%,rgba(255,255,255,.06))]" />
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-muted font-medium">ONLINE</span>
              </div>
              <div className="text-xs text-muted">Software Engineer @ Monash University</div>
            </div>
          </motion.div>
        </div>

        {/* Terminal block */}
        <div className="w-full min-w-0">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
          >
            Matthew Chung Kai Shing
          </motion.h2>

          {/* Glass terminal */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glass w-full">
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#34d399]" />
                <span className="ml-3 text-xs text-muted">ai@portfolio:~</span>
              </div>
              <CopyButton text={BIO} />
            </div>

            {/* Prompt + output */}
            <div className="px-4 py-4 text-sm overflow-x-auto">
              <div className="font-mono text-[13px] text-text break-all">
                <span className="text-cyan">{prompt}</span>
                {!reduce && <span className="caret text-cyan" aria-hidden="true" />}
              </div>
              <p className="mt-3 text-[15px] leading-7 text-muted break-words">{BIO}</p>
            </div>

            {/* Token marquee */}
            <div
              className="relative select-none overflow-hidden border-t border-white/10 bg-black/10 py-3"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
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
                  <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs & socials */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a className="focus-ring rounded-xl bg-indigo/90 px-4 py-2 text-sm text-white hover:bg-indigo" href="/resume.pdf">
              Download Résumé
            </a>
            <a className="focus-ring rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/5" href="#contact">
              Contact
            </a>
            <div className="ml-1 flex items-center gap-2">
              <a
                aria-label="LinkedIn"
                className="focus-ring rounded-full border border-white/15 p-2 hover:bg-white/5"
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="h-4 w-4 text-cyan" />
              </a>
              <a
                aria-label="GitHub"
                className="focus-ring rounded-full border border-white/15 p-2 hover:bg-white/5"
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4 text-cyan" />
              </a>
              <a
                aria-label="Email"
                className="focus-ring rounded-full border border-white/15 p-2 hover:bg-white/5"
                href="mailto:hello@example.com"
              >
                <Mail className="h-4 w-4 text-cyan" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
