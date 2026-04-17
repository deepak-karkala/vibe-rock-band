"use client";

import { useMemo, useState } from "react";
import type { SessionStatus } from "@/lib/contracts";
import type { BandTheme } from "@/lib/theme-data";

type PromptRailProps = {
  theme: BandTheme;
  status: SessionStatus;
  currentDirection: string;
  pendingDirection: string;
  error: string | null;
  shareUnlocked: boolean;
  isSubmitting: boolean;
  metrics?: { directMs?: number; generateMs?: number; totalMs?: number } | null;
  onSubmitDirection: (direction: string) => Promise<void>;
  onExportRecap: () => Promise<void>;
};

const statusCopy: Record<SessionStatus, string> = {
  "theme-picker": "Choose the band. Set the room first.",
  "pre-show": "The band is waiting for the first cue.",
  pending: "The band is reworking the arrangement.",
  playing: "The room is moving. Push it somewhere else.",
  error: "The set slipped. Reset the cue and go again.",
};

export function PromptRail({
  theme,
  status,
  currentDirection,
  pendingDirection,
  error,
  shareUnlocked,
  isSubmitting,
  metrics,
  onSubmitDirection,
  onExportRecap,
}: PromptRailProps) {
  const [direction, setDirection] = useState(theme.defaultDirection);
  const statusLine = useMemo(() => {
    if (status === "pending" && pendingDirection) {
      return `Reworking toward "${pendingDirection}"`;
    }

    return statusCopy[status];
  }, [pendingDirection, status]);

  return (
    <aside className="flex h-full flex-col rounded-[28px] panel px-4 py-4 md:px-5 md:py-5">
      <div className="mb-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
              Director rail
            </p>
            <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
              {theme.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => void onExportRecap()}
            disabled={!shareUnlocked}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-[var(--text-primary)] disabled:cursor-not-allowed disabled:text-[var(--text-muted)]"
          >
            {shareUnlocked ? "Save the moment" : "Locked"}
          </button>
        </div>

        <p className="text-sm leading-6 text-secondary">{theme.summary}</p>
        <div className="rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
            Stage status
          </p>
          <p className="mt-2 text-sm leading-6">{statusLine}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {theme.presetButtons.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDirection(`Make it feel like ${preset}, but still ${theme.mood.toLowerCase()}.`)}
              className="rounded-full border border-[var(--border)] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-secondary transition hover:text-[var(--text-primary)]"
            >
              {preset}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
            Type the next cue
          </span>
          <textarea
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
            rows={5}
            className="w-full rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-base leading-7 outline-none transition placeholder:text-[var(--text-muted)] focus:border-[rgba(203,184,157,0.36)]"
            placeholder="Make it heavier, slower, and impossible to ignore."
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void onSubmitDirection(direction)}
            className="ember-glow rounded-full bg-[var(--accent-primary)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fef7ef] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
          >
            {isSubmitting ? "Driving the change..." : "Send direction"}
          </button>
          <button
            type="button"
            onClick={() => setDirection(theme.defaultDirection)}
            className="rounded-full border border-[var(--border)] px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-secondary transition hover:text-[var(--text-primary)]"
          >
            Reset cue
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
            Suggested first moves
          </p>
          <div className="space-y-2">
            {theme.suggestedDirections.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setDirection(suggestion)}
                className="block w-full rounded-[18px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-left text-sm leading-6 text-secondary transition hover:text-[var(--text-primary)]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
            Current visible direction
          </p>
          <p className="mt-2 text-sm leading-6 text-secondary">
            {currentDirection || "Nothing yet. Give the band the first real instruction."}
          </p>
        </div>

        {metrics ? (
          <div className="rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
              Layer 2 trace hooks
            </p>
            <div className="mt-3 space-y-2 font-mono text-sm text-secondary">
              <p>director: {metrics.directMs ?? 0}ms</p>
              <p>generate: {metrics.generateMs ?? 0}ms</p>
              <p>total: {metrics.totalMs ?? 0}ms</p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[20px] border border-[rgba(162,54,33,0.45)] bg-[rgba(162,54,33,0.12)] px-4 py-3 text-sm leading-6">
            {error}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
