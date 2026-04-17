import { z } from "zod";

export const bandCharacters = ["Zara", "Miles", "Rex", "Luna", "Kai"] as const;

export type BandCharacter = (typeof bandCharacters)[number];

export type WeightedPrompt = {
  text: string;
  weight: number;
};

export type Announcement = {
  character: BandCharacter;
  text: string;
};

export type SessionStatus =
  | "theme-picker"
  | "pre-show"
  | "pending"
  | "playing"
  | "error";

export type MusicDirectionResponse = {
  prompts: WeightedPrompt[];
  bpm: number;
  temperature: number;
  announcement: Announcement;
};

export const directRequestSchema = z.object({
  themeId: z.string().min(1),
  direction: z.string().trim().min(1).max(240),
});

export const weightedPromptSchema = z.object({
  text: z.string().trim().min(1).max(280),
  weight: z.number(),
});

export const directResponseSchema = z.object({
  prompts: z.array(weightedPromptSchema),
  bpm: z.number(),
  temperature: z.number(),
  announcement: z.object({
    character: z.enum(bandCharacters),
    text: z.string(),
  }),
});

export const generateRequestSchema = z.object({
  prompts: z.array(weightedPromptSchema).min(1),
  bpm: z.number(),
  temperature: z.number(),
});
