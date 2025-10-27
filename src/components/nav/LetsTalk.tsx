"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Linkedin, Facebook, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LetsTalk({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        className="focus-ring rounded-full bg-[#1f2430] px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#2a3040]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        LET&apos;S TALK
        <span className="ml-1 inline-block select-none">•</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 z-50 glass w-64 border p-3"
            role="menu"
            aria-label="Quick contacts"
          >
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-white/6 transition-colors"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn (placeholder)"
                >
                  <Linkedin className="h-4 w-4 text-cyan" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-white/6 transition-colors"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook (placeholder)"
                >
                  <Facebook className="h-4 w-4 text-cyan" /> Facebook
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-white/6 transition-colors"
                  href="tel:+000000000"
                  aria-label="Phone (placeholder)"
                >
                  <Phone className="h-4 w-4 text-cyan" /> +00 0000 0000
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-white/6 transition-colors"
                  href="mailto:hello@example.com"
                  aria-label="Email (placeholder)"
                >
                  <Mail className="h-4 w-4 text-cyan" /> hello@example.com
                </a>
              </li>
            </ul>
            <p className="mt-2 text-xs text-muted">Replace these URLs with your real links.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
