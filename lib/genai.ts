import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;

type TextCandidate = {
  content?: {
    parts?: Array<{ text?: string }>;
  };
};

export function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }

  return cachedClient;
}

export function getTextFromGenAIResponse(response: unknown) {
  if (!response || typeof response !== "object") {
    return "";
  }

  const maybeTextMethod = (response as { text?: () => string }).text;
  if (typeof maybeTextMethod === "function") {
    return maybeTextMethod.call(response);
  }

  const maybeTextValue = (response as { text?: string }).text;
  if (typeof maybeTextValue === "string") {
    return maybeTextValue;
  }

  const candidates = (response as { candidates?: TextCandidate[] }).candidates;
  if (Array.isArray(candidates)) {
    return candidates
      .flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("\n")
      .trim();
  }

  return "";
}
