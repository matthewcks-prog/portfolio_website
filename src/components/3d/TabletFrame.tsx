"use client";

import React from "react";

export default function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-8 w-full max-w-[800px] aspect-[16/9] rounded-2xl border border-white/20 bg-gradient-to-b from-[#1a1a22] to-black shadow-[0_40px_120px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.1)_inset] overflow-hidden">
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
