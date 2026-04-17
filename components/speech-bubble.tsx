"use client";

import { getThemeById } from "@/lib/theme-data";
import type { Announcement } from "@/lib/contracts";

type SpeechBubbleProps = {
  announcement: Announcement | null;
  themeId: string;
};

const positions: Record<Announcement["character"], string> = {
  Zara: "left-[8%] top-[26%]",
  Miles: "left-[28%] top-[18%]",
  Rex: "left-[46%] top-[16%]",
  Luna: "left-[63%] top-[19%]",
  Kai: "left-[76%] top-[26%]",
};

export function SpeechBubble({ announcement, themeId }: SpeechBubbleProps) {
  if (!announcement) {
    return null;
  }

  const theme = getThemeById(themeId);
  const member = theme.members.find(
    (item) => item.character === announcement.character,
  );

  return (
    <div
      className={`pointer-events-none absolute z-10 max-w-[15rem] rounded-[22px] rounded-bl-[8px] border border-[var(--border)] bg-[rgba(18,14,13,0.92)] px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl ${positions[announcement.character]}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: member?.accent ?? "#cbb89d" }}
        />
        <p className="font-display text-sm tracking-[0.03em]">
          {announcement.character}
        </p>
      </div>
      <p className="text-sm leading-5 text-[var(--text-primary)]">
        {announcement.text}
      </p>
    </div>
  );
}
