"use client";

import { useMemo, useRef } from "react";
import { PromptRail } from "@/components/prompt-rail";
import { Stage, type StageHandle } from "@/components/stage";
import { ThemePicker } from "@/components/theme-picker";
import { exportRecapCard } from "@/lib/recap";
import type { BandTheme } from "@/lib/theme-data";
import { getThemeById } from "@/lib/theme-data";
import { useBandSessionStore } from "@/stores/band-session-store";
import { useBandSession } from "@/hooks/use-band-session";

export function BandExperience() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stageRef = useRef<StageHandle | null>(null);
  const {
    selectedTheme,
    sessionStatus,
    currentDirection,
    pendingDirection,
    announcement,
    audioLevel,
    error,
    shareUnlocked,
    metrics,
    setSelectedTheme,
  } = useBandSessionStore();
  const { submitDirection, isSubmitting } = useBandSession(audioRef);

  const theme = useMemo(
    () => (selectedTheme ? getThemeById(selectedTheme) : null),
    [selectedTheme],
  );

  const handleSelectTheme = (nextTheme: BandTheme) => {
    setSelectedTheme(nextTheme.id);
  };

  const handleExportRecap = async () => {
    if (!selectedTheme || !shareUnlocked) {
      return;
    }

    const stageImage = stageRef.current?.capture();
    if (!stageImage) {
      useBandSessionStore.getState().setError(
        "The stage image came back blank. Try another moment.",
      );
      return;
    }

    try {
      await exportRecapCard({
        themeId: selectedTheme,
        direction: currentDirection,
        announcement,
        stageImageDataUrl: stageImage,
      });
    } catch (error) {
      useBandSessionStore.getState().setError(
        error instanceof Error
          ? error.message
          : "The recap card couldn't be rendered.",
      );
    }
  };

  if (!theme) {
    return <ThemePicker onSelectTheme={handleSelectTheme} />;
  }

  return (
    <main className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1280px] gap-4 md:grid-cols-[minmax(0,1.9fr)_minmax(320px,1fr)] md:gap-5">
        <Stage
          ref={stageRef}
          themeId={theme.id}
          audioLevel={audioLevel}
          sessionStatus={sessionStatus}
          announcement={announcement}
        />
        <PromptRail
          theme={theme}
          status={sessionStatus}
          currentDirection={currentDirection}
          pendingDirection={pendingDirection}
          error={error}
          shareUnlocked={shareUnlocked}
          isSubmitting={isSubmitting}
          metrics={metrics}
          onSubmitDirection={submitDirection}
          onExportRecap={handleExportRecap}
        />
      </div>
      <audio ref={audioRef} className="hidden" preload="auto" />
    </main>
  );
}
