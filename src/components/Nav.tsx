"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className={cn("font-semibold tracking-tight text-text")}>
          <span className="text-cyan">▥</span> Matthew
        </Link>
        <nav className="flex gap-6 text-sm text-muted">
          <Link className="hover:text-text focus-ring" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-text focus-ring" href="/about">
            About
          </Link>
          <Link className="hover:text-text focus-ring" href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
