"use client";
import { useState } from "react";
import { Check, Clipboard } from "lucide-react";

export default function CopyButton({ text, className }: { text: string; className?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className={`focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 ${className ?? ""}`}
      aria-label="Copy text"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1200);
        } catch {}
      }}
    >
      {ok ? <Check className="h-3.5 w-3.5 text-cyan" /> : <Clipboard className="h-3.5 w-3.5 text-muted" />}
      {ok ? "Copied" : "Copy"}
    </button>
  );
}
