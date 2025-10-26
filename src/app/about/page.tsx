"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <motion.div {...fadeIn}>
        <h1 className="text-4xl font-semibold tracking-tight">About Me</h1>
        <p className="mt-4 text-lg text-muted">
          I'm a software engineer focused on building reliable, performant systems with delightful user experiences.
        </p>
      </motion.div>

      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }} className="mt-12">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-medium">Background</h2>
          <p className="mt-4 text-muted leading-relaxed">
            With experience spanning full-stack development, 3D graphics, and cloud infrastructure, I enjoy tackling complex problems that
            require both technical depth and design sensibility.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            I believe in writing code that's maintainable, accessible, and performant—treating every project as an opportunity to learn and
            improve.
          </p>
        </GlassCard>
      </motion.div>

      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }} className="mt-8">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-medium">Skills</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-cyan">Frontend</h3>
              <p className="mt-2 text-sm text-muted">React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js / R3F</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-cyan">Backend</h3>
              <p className="mt-2 text-sm text-muted">Node.js, Python, PostgreSQL, Redis, REST & GraphQL APIs</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-cyan">DevOps</h3>
              <p className="mt-2 text-sm text-muted">Docker, Kubernetes, CI/CD, GitHub Actions, Vercel, AWS</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-cyan">Design</h3>
              <p className="mt-2 text-sm text-muted">Figma, UI/UX principles, Accessibility (WCAG), Responsive design</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
