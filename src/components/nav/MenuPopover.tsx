"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT ME" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "hobbies", label: "HOBBIES" },
  { id: "contact", label: "CONTACT" },
];

export default function MenuPopover({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const active = useSectionObserver(SECTIONS.map((s) => s.id));

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
        className="focus-ring inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-[#111] transition-colors hover:bg-white/90"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        MENU <MoreHorizontal className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-[#f7f8fb] text-[#111] shadow-lg"
            role="menu"
            aria-label="Main menu"
          >
            <ul className="p-3">
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={cn(
                        "group relative flex items-center justify-between rounded-xl px-3 py-3 text-base transition-colors",
                        isActive ? "bg-[#e9ecff] text-[#0b0f1a] font-semibold" : "hover:bg-black/5"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "inline-block h-2 w-2 rounded-full transition-colors",
                            isActive ? "bg-[#0b0f1a]" : "bg-[#0b0f1a]/60"
                          )}
                        />
                        {s.label}
                      </span>
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
