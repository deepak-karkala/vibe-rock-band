"use client";

import { bandThemes, type BandTheme } from "@/lib/theme-data";

type ThemePickerProps = {
  onSelectTheme: (theme: BandTheme) => void;
};

export function ThemePicker({ onSelectTheme }: ThemePickerProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col justify-between rounded-[32px] border border-[var(--border)] panel px-6 py-8 md:px-10 md:py-10">
        <header className="space-y-5">
          <p className="font-display text-xs uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
            Vibe Rock Band
          </p>
          <div className="max-w-4xl space-y-4">
            <h1 className="font-display text-5xl leading-[0.94] tracking-[-0.04em] md:text-7xl">
              Pick the band. Then pull the room wherever you want.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-secondary md:text-lg">
              This is not a waveform toy. It is a stage with opinions. Choose the
              band fantasy first, then direct the night with typed cues.
            </p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bandThemes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme)}
              className="group rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-5 py-5 text-left transition duration-200 hover:-translate-y-1 hover:border-[rgba(203,184,157,0.36)] hover:bg-[rgba(255,255,255,0.05)]"
            >
              <div
                className="mb-5 rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-cinematic p-4"
                style={{
                  boxShadow: `inset 0 0 40px ${theme.members[0]?.accent ?? "#a23621"}22`,
                }}
              >
                <div className="mb-6 flex justify-between text-[10px] uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
                  <span>{theme.stageLabel}</span>
                  <span>{theme.members.length} players</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {theme.members.map((member) => (
                    <div
                      key={member.character}
                      className="h-20 rounded-[18px] border border-[rgba(255,255,255,0.08)]"
                      style={{
                        background: `linear-gradient(180deg, ${member.accent}22, rgba(255,255,255,0.03))`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl leading-none tracking-[-0.03em]">
                      {theme.name}
                    </h2>
                    <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
                      {theme.mood}
                    </p>
                  </div>
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                    Enter
                  </span>
                </div>

                <p className="max-w-md text-sm leading-6 text-secondary">
                  {theme.summary}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
