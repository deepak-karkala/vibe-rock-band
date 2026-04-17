import {
  bandCharacters,
  type MusicDirectionResponse,
  type WeightedPrompt,
} from "@/lib/contracts";
import { getGenAIClient, getTextFromGenAIResponse } from "@/lib/genai";
import { getThemeById } from "@/lib/theme-data";

const FALLBACK_CHARACTER = "Kai";

const directorSystemPrompt = `You are the music director for Vibe Rock Band.
Translate the user's request into weighted music prompts, bpm, temperature, and a short in-character band announcement.

Band members:
- Zara: guitarist, chaotic, punk energy. Speaks when things go heavy, distorted, or aggressive.
- Miles: keyboardist, smooth and atmospheric. Speaks when things get spacious, dreamy, or melodically rich.
- Rex: drummer, groove-obsessed. Speaks when rhythm should tighten, simplify, or hit harder.
- Luna: bassist, mysterious and deep. Speaks on darker mood shifts and low-end pressure.
- Kai: vocalist/MC, welcoming, hype, default fallback.

Return strict JSON with this shape:
{
  "prompts": [{"text": "string", "weight": 1.0}],
  "bpm": 100,
  "temperature": 1.0,
  "announcement": {"character": "Kai", "text": "string"}
}

Rules:
- announcement must always exist
- character must be one of Zara, Miles, Rex, Luna, Kai
- prompts must be practical music-language directions
- keep the announcement short and stage-ready
- do not wrap the JSON in prose`;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizePrompts(prompts: WeightedPrompt[] | undefined, direction: string) {
  const safePrompts =
    prompts
      ?.filter((prompt) => prompt.text?.trim())
      .map((prompt) => ({
        text: prompt.text.trim(),
        weight: clamp(prompt.weight, 0.1, 1.5),
      })) ?? [];

  if (safePrompts.length > 0) {
    return safePrompts;
  }

  return [{ text: direction.trim(), weight: 1 }];
}

function normalizeAnnouncement(
  announcement: MusicDirectionResponse["announcement"] | undefined,
  direction: string,
) {
  const safeCharacter = bandCharacters.includes(
    (announcement?.character ?? FALLBACK_CHARACTER) as (typeof bandCharacters)[number],
  )
    ? (announcement?.character ?? FALLBACK_CHARACTER)
    : FALLBACK_CHARACTER;

  const safeText =
    announcement?.text?.trim() ||
    `Kai pulls the band toward "${direction.trim().slice(0, 48)}".`;

  return {
    character: safeCharacter,
    text: safeText,
  };
}

function stripJsonFences(raw: string) {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function normalizeDirectionResponse(
  payload: unknown,
  direction: string,
): MusicDirectionResponse {
  let candidate: unknown = payload;

  if (typeof payload === "string") {
    try {
      candidate = JSON.parse(stripJsonFences(payload));
    } catch {
      candidate = undefined;
    }
  }

  if (candidate && typeof candidate === "object") {
    const raw = candidate as Partial<MusicDirectionResponse> & {
      prompts?: WeightedPrompt[];
      announcement?: Partial<MusicDirectionResponse["announcement"]>;
    };

    const announcement =
      raw.announcement && typeof raw.announcement === "object"
        ? {
            character: raw.announcement.character as MusicDirectionResponse["announcement"]["character"],
            text:
              typeof raw.announcement.text === "string"
                ? raw.announcement.text
                : "",
          }
        : undefined;

    return {
      prompts: normalizePrompts(raw.prompts, direction),
      bpm: clamp(
        typeof raw.bpm === "number" ? raw.bpm : 100,
        60,
        180,
      ),
      temperature: clamp(
        typeof raw.temperature === "number" ? raw.temperature : 1,
        0.2,
        2,
      ),
      announcement: normalizeAnnouncement(announcement, direction),
    };
  }

  return {
    prompts: normalizePrompts(undefined, direction),
    bpm: 100,
    temperature: 1,
      announcement: normalizeAnnouncement(undefined, direction),
  };
}

export async function runMusicDirector(themeId: string, direction: string) {
  const theme = getThemeById(themeId);
  const model = process.env.GEMINI_DIRECTOR_MODEL || "gemini-2.5-pro";
  const ai = getGenAIClient();

  const prompt = [
    directorSystemPrompt,
    `Band theme: ${theme.name}`,
    `Theme mood: ${theme.mood}`,
    `Theme summary: ${theme.summary}`,
    `Direction: ${direction}`,
  ].join("\n\n");

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    } as never);

    return normalizeDirectionResponse(getTextFromGenAIResponse(response), direction);
  } catch {
    return normalizeDirectionResponse(undefined, direction);
  }
}
