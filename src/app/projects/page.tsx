"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

export default function ProjectsPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  };

  const projects = [
    {
      title: "Realtime Dashboard",
      summary: "Real-time analytics platform processing 100K+ events/sec with sub-50ms latency.",
      tags: ["TypeScript", "Next.js", "WebSocket", "PostgreSQL"],
    },
    {
      title: "3D Product Configurator",
      summary: "Interactive 3D product viewer with AR preview, reducing returns by 34%.",
      tags: ["React Three Fiber", "Three.js", "WebXR"],
    },
    {
      title: "CI/CD Accelerator",
      summary: "Build pipeline optimization tool that cut deployment times by 67%.",
      tags: ["Node.js", "Docker", "Kubernetes", "GitHub Actions"],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <motion.div {...fadeIn} className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-3 text-muted">Selected work showcasing design, engineering, and impact.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.div key={project.title} {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.06 * i }}>
            <GlassCard className="p-6">
              <h3 className="text-xl font-medium">{project.title}</h3>
              <p className="mt-3 text-sm text-muted">{project.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs text-cyan">
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
