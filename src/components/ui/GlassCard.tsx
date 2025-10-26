import { cn } from "@/lib/utils";

export default function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass border text-text", className)}>{children}</div>;
}
