"use client";

import dynamic from "next/dynamic";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Announcement, SessionStatus } from "@/lib/contracts";
import { SpeechBubble } from "@/components/speech-bubble";
import { getThemeById } from "@/lib/theme-data";

const StageCanvas = dynamic(() => import("./stage-canvas"), { ssr: false });

export type StageHandle = {
  capture: () => string | null;
};

type StageProps = {
  themeId: string;
  audioLevel: number;
  sessionStatus: SessionStatus;
  announcement: Announcement | null;
};

export const Stage = forwardRef<StageHandle, StageProps>(function Stage(
  { themeId, audioLevel, sessionStatus, announcement },
  ref,
) {
  const captureRef = useRef<(() => string | null) | null>(null);
  const theme = getThemeById(themeId);

  useImperativeHandle(ref, () => ({
    capture: () => captureRef.current?.() ?? null,
  }));

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[var(--border)] panel-strong min-h-[28rem] md:min-h-[42rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,231,211,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%)]" />
      <div className="absolute left-5 top-5 z-10 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
        {sessionStatus === "pending" ? "Band reworking the set" : theme.stageLabel}
      </div>
      <div className="absolute bottom-5 left-5 z-10 flex gap-2">
        {theme.members.map((member) => (
          <div
            key={member.character}
            className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--text-secondary)]"
          >
            {member.character}
          </div>
        ))}
      </div>
      <SpeechBubble announcement={announcement} themeId={themeId} />
      <StageCanvas
        themeId={themeId}
        audioLevel={audioLevel}
        setCaptureHandler={(handler) => {
          captureRef.current = handler;
        }}
      />
    </section>
  );
});
