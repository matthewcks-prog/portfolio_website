"use client";

import SoundControl from "@/components/media/SoundControl";
import LetsTalk from "@/components/nav/LetsTalk";
import MenuPopover from "@/components/nav/MenuPopover";

export default function TopRightBar() {
  return (
    <div className="flex items-center gap-3">
      <SoundControl />
      <LetsTalk />
      <MenuPopover />
    </div>
  );
}
