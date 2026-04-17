import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getClientIp = vi.fn();
const enforceRateLimit = vi.fn();
const generateClipAudio = vi.fn();

vi.mock("@/lib/rate-limit", () => ({
  getClientIp,
  enforceRateLimit,
}));

vi.mock("@/lib/music-generate", () => ({
  generateClipAudio,
}));

describe("POST /api/music/generate", () => {
  beforeEach(() => {
    getClientIp.mockReturnValue("127.0.0.1");
    enforceRateLimit.mockReturnValue({ allowed: true, remaining: 9 });
    generateClipAudio.mockResolvedValue(Buffer.from("mp3"));
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns 429 when the generate route is rate limited", async () => {
    enforceRateLimit.mockReturnValue({ allowed: false, remaining: 0 });
    const { POST } = await import("@/app/api/music/generate/route");

    const response = await POST(
      new Request("http://localhost:3000/api/music/generate", {
        method: "POST",
        body: JSON.stringify({
          prompts: [{ text: "heavy guitars", weight: 1 }],
          bpm: 92,
          temperature: 0.8,
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "Daily limit reached — try again tomorrow.",
    });
    expect(generateClipAudio).not.toHaveBeenCalled();
  });

  it("returns 400 when the payload is invalid", async () => {
    const { POST } = await import("@/app/api/music/generate/route");

    const response = await POST(
      new Request("http://localhost:3000/api/music/generate", {
        method: "POST",
        body: JSON.stringify({ prompts: [], bpm: 92 }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Music generation payload was incomplete.",
    });
    expect(generateClipAudio).not.toHaveBeenCalled();
  });

  it("returns audio for a valid generation request", async () => {
    const { POST } = await import("@/app/api/music/generate/route");

    const response = await POST(
      new Request("http://localhost:3000/api/music/generate", {
        method: "POST",
        body: JSON.stringify({
          prompts: [{ text: "heavy guitars", weight: 1 }],
          bpm: 92,
          temperature: 0.8,
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(enforceRateLimit).toHaveBeenCalledWith("127.0.0.1", "music-generate");
    expect(generateClipAudio).toHaveBeenCalledWith(
      [{ text: "heavy guitars", weight: 1 }],
      92,
      0.8,
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.arrayBuffer()).resolves.toEqual(
      Uint8Array.from(Buffer.from("mp3")).buffer,
    );
  });

  it("returns 502 with the upstream error message when generation fails", async () => {
    generateClipAudio.mockRejectedValue(new Error("Lyria request failed"));
    const { POST } = await import("@/app/api/music/generate/route");

    const response = await POST(
      new Request("http://localhost:3000/api/music/generate", {
        method: "POST",
        body: JSON.stringify({
          prompts: [{ text: "heavy guitars", weight: 1 }],
          bpm: 92,
          temperature: 0.8,
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "Lyria request failed",
    });
  });
});
