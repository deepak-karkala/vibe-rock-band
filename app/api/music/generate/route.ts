import { NextResponse } from "next/server";
import { generateRequestSchema } from "@/lib/contracts";
import { generateClipAudio } from "@/lib/music-generate";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rateLimit = enforceRateLimit(ip, "music-generate");

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Daily limit reached — try again tomorrow." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = generateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Music generation payload was incomplete." },
      { status: 400 },
    );
  }

  try {
    const audioBuffer = await generateClipAudio(
      parsed.data.prompts,
      parsed.data.bpm,
      parsed.data.temperature,
    );

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The band couldn't get the next clip ready.",
      },
      { status: 502 },
    );
  }
}
