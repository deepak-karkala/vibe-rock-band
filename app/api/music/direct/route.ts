import { NextResponse } from "next/server";
import { directRequestSchema } from "@/lib/contracts";
import { runMusicDirector } from "@/lib/music-direct";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rateLimit = enforceRateLimit(ip, "music-direct");

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Daily limit reached — try again tomorrow." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = directRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Try a different description." },
      { status: 400 },
    );
  }

  const result = await runMusicDirector(
    parsed.data.themeId,
    parsed.data.direction,
  );

  return NextResponse.json(result);
}
