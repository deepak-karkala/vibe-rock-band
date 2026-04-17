import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getClientIp = vi.fn();
const enforceRateLimit = vi.fn();
const runMusicDirector = vi.fn();

vi.mock("@/lib/rate-limit", () => ({
  getClientIp,
  enforceRateLimit,
}));

vi.mock("@/lib/music-direct", () => ({
  runMusicDirector,
}));

describe("POST /api/music/direct", () => {
  beforeEach(() => {
    getClientIp.mockReturnValue("127.0.0.1");
    enforceRateLimit.mockReturnValue({ allowed: true, remaining: 9 });
    runMusicDirector.mockResolvedValue({
      prompts: [{ text: "cathedral dark", weight: 1 }],
      bpm: 92,
      temperature: 0.7,
      announcement: {
        character: "Kai",
        text: "Pull it into the dark.",
      },
    });
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns 429 when the direct route is rate limited", async () => {
    enforceRateLimit.mockReturnValue({ allowed: false, remaining: 0 });
    const { POST } = await import("@/app/api/music/direct/route");

    const response = await POST(
      new Request("http://localhost:3000/api/music/direct", {
        method: "POST",
        body: JSON.stringify({ themeId: "midnight-cathedral", direction: "heavier" }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "Daily limit reached — try again tomorrow.",
    });
    expect(runMusicDirector).not.toHaveBeenCalled();
  });

  it("returns 400 when the payload is invalid", async () => {
    const { POST } = await import("@/app/api/music/direct/route");

    const response = await POST(
      new Request("http://localhost:3000/api/music/direct", {
        method: "POST",
        body: JSON.stringify({ themeId: "", direction: "" }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Try a different description.",
    });
    expect(runMusicDirector).not.toHaveBeenCalled();
  });

  it("returns normalized director output for a valid request", async () => {
    const { POST } = await import("@/app/api/music/direct/route");

    const response = await POST(
      new Request("http://localhost:3000/api/music/direct", {
        method: "POST",
        body: JSON.stringify({
          themeId: "midnight-cathedral",
          direction: "Make it slower and heavier.",
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(getClientIp).toHaveBeenCalled();
    expect(enforceRateLimit).toHaveBeenCalledWith("127.0.0.1", "music-direct");
    expect(runMusicDirector).toHaveBeenCalledWith(
      "midnight-cathedral",
      "Make it slower and heavier.",
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      prompts: [{ text: "cathedral dark", weight: 1 }],
      bpm: 92,
      temperature: 0.7,
      announcement: {
        character: "Kai",
        text: "Pull it into the dark.",
      },
    });
  });
});
