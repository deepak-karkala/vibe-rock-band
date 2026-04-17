import type { WeightedPrompt } from "@/lib/contracts";
import { getGenAIClient } from "@/lib/genai";

export function buildGenerationPrompt(
  prompts: WeightedPrompt[],
  bpm: number,
  temperature: number,
) {
  const promptText = prompts
    .map((prompt) => `${prompt.text} (weight ${prompt.weight.toFixed(2)})`)
    .join(", ");

  return `Generate a rock-band clip with these weighted directions: ${promptText}. Tempo ${bpm} BPM. Intensity temperature ${temperature}. Return audio only.`;
}

export function extractAudioPart(response: unknown) {
  const candidates = (response as { candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> } }> }).candidates;
  const parts =
    candidates?.flatMap((candidate) => candidate.content?.parts ?? []) ?? [];

  return parts.find(
    (part) => part.inlineData?.mimeType === "audio/mpeg" && part.inlineData.data,
  );
}

export async function generateClipAudio(
  prompts: WeightedPrompt[],
  bpm: number,
  temperature: number,
) {
  const ai = getGenAIClient();
  const model = process.env.LYRIA_CLIP_MODEL || "lyria-3.1-generate-preview";
  const content = buildGenerationPrompt(prompts, bpm, temperature);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: content,
        config: {
          responseModalities: ["AUDIO"],
        },
      } as never);

      const audioPart = extractAudioPart(response);
      if (!audioPart?.inlineData?.data) {
        throw new Error("Audio part missing from Lyria response");
      }

      return Buffer.from(audioPart.inlineData.data, "base64");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Lyria request failed");
    }
  }

  throw lastError ?? new Error("Lyria request failed");
}
