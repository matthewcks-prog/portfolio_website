"use client";

import TopRightBar from "@/components/nav/TopRightBar";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/20">
      <div className="mx-auto flex max-w-7xl items-center justify-end px-6 py-4">
        <TopRightBar />
      </div>
    </header>
  );
}
