import { forwardRef, useImperativeHandle } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BandExperience } from "@/components/band-experience";
import { useBandSessionStore } from "@/stores/band-session-store";

vi.mock("@/components/stage", () => ({
  Stage: forwardRef(function MockStage(_, ref) {
    useImperativeHandle(ref, () => ({
      capture: () => "data:image/png;base64,stage",
    }));

    return <div>Mock stage</div>;
  }),
}));

class MockAudioContext {
  state = "running";

  createAnalyser() {
    return {
      fftSize: 0,
      frequencyBinCount: 32,
      connect: vi.fn(),
      disconnect: vi.fn(),
      getByteFrequencyData: (array: Uint8Array) => array.fill(0),
    };
  }

  createMediaElementSource() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }

  resume = vi.fn(async () => undefined);
  close = vi.fn(async () => undefined);
}

describe("BandExperience regression", () => {
  beforeEach(() => {
    useBandSessionStore.setState({
      selectedTheme: null,
      sessionStatus: "theme-picker",
      activeRequestId: 0,
      pendingDirection: "",
      currentDirection: "",
      announcement: null,
      isPlaying: false,
      audioLevel: 0,
      error: null,
      shareUnlocked: false,
      metrics: null,
    });

    vi.restoreAllMocks();

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          prompts: [{ text: "heavy and slow", weight: 1 }],
          bpm: 92,
          temperature: 0.7,
          announcement: {
            character: "Kai",
            text: "We are dragging the room into the dark.",
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(["mp3"], { type: "audio/mpeg" }),
      }) as typeof fetch;

    vi.stubGlobal("AudioContext", MockAudioContext);
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    URL.createObjectURL = vi.fn(() => "blob:mock-audio");
    URL.revokeObjectURL = vi.fn();

    Object.defineProperty(HTMLMediaElement.prototype, "load", {
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: vi.fn(function play(this: HTMLMediaElement) {
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      }),
    });
  });

  it(
    "unlocks recap sharing after the first clip starts playing",
    async () => {
    // Regression: ISSUE-001 — share stayed locked after playback started
    // Found by /qa on 2026-04-17
    // Report: .gstack/qa-reports/qa-report-localhost-2026-04-17.md
    render(<BandExperience />);

      fireEvent.click(
        screen.getByRole("button", { name: /midnight cathedral/i }),
      );

      const sendButton = await screen.findByRole("button", {
        name: /send direction/i,
      });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /save the moment/i }).hasAttribute(
            "disabled",
          ),
        ).toBe(false);
      });
    },
    20000,
  );
});
