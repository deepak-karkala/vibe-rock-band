import { describe, expect, it } from "vitest";
import { buildGenerationPrompt, extractAudioPart } from "@/lib/music-generate";

describe("music generate helpers", () => {
  it("extracts the audio part after text parts", () => {
    const audioPart = extractAudioPart({
      candidates: [
        {
          content: {
            parts: [
              { text: "Verse lyrics" },
              {
                inlineData: {
                  mimeType: "audio/mpeg",
                  data: "ZGF0YQ==",
                },
              },
            ],
          },
        },
      ],
    });

    expect(audioPart?.inlineData?.mimeType).toBe("audio/mpeg");
  });

  it("builds a generation prompt from weighted prompts", () => {
    const prompt = buildGenerationPrompt(
      [{ text: "heavy guitars", weight: 1 }],
      92,
      0.8,
    );

    expect(prompt).toContain("heavy guitars");
    expect(prompt).toContain("92 BPM");
    expect(prompt).toContain("0.8");
  });
});
