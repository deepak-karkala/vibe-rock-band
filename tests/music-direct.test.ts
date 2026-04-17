import { describe, expect, it } from "vitest";
import { normalizeDirectionResponse } from "@/lib/music-direct";

describe("normalizeDirectionResponse", () => {
  it("normalizes unknown characters to Kai", () => {
    const result = normalizeDirectionResponse(
      {
        prompts: [{ text: "dark heavy guitars", weight: 2.2 }],
        bpm: 220,
        temperature: 3,
        announcement: {
          character: "Ghost",
          text: "",
        },
      },
      "make it darker",
    );

    expect(result.announcement.character).toBe("Kai");
    expect(result.bpm).toBe(180);
    expect(result.temperature).toBe(2);
    expect(result.prompts[0]?.weight).toBe(1.5);
  });

  it("strips fenced json and falls back to raw text if prompts are empty", () => {
    const result = normalizeDirectionResponse(
      "```json\n{\"prompts\":[],\"bpm\":90,\"temperature\":1,\"announcement\":{\"character\":\"Kai\",\"text\":\"\"}}\n```",
      "make it slower",
    );

    expect(result.prompts).toEqual([{ text: "make it slower", weight: 1 }]);
    expect(result.announcement.text.length).toBeGreaterThan(0);
  });
});
