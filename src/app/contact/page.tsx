"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const fadeIn = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <motion.div {...fadeIn}>
        <h1 className="text-4xl font-semibold tracking-tight">Get in Touch</h1>
        <p className="mt-4 text-muted">Have a project idea or just want to chat? Send me a message.</p>
      </motion.div>

      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }} className="mt-12">
        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-text placeholder:text-muted"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-text placeholder:text-muted"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-text placeholder:text-muted"
                placeholder="Tell me about your project..."
              />
            </div>

            <Button type="submit" disabled={status === "loading"} className="w-full">
              {status === "loading" ? "Sending..." : "Send Message"}
            </Button>

            {status === "success" && <p className="text-sm text-success">Message sent successfully! I'll get back to you soon.</p>}
            {status === "error" && <p className="text-sm text-error">Something went wrong. Please try again.</p>}
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
