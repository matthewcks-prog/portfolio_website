"use client";

import { useEffect, useState } from "react";

export function useSectionObserver(ids: string[], rootMargin = "-25% 0px -55% 0px") {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { root: null, rootMargin, threshold: [0.2, 0.5, 0.8] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids, rootMargin]);

  return active;
}
