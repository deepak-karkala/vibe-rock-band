"use client";

import { create } from "zustand";
import type { Announcement, SessionStatus } from "@/lib/contracts";

type Metrics = {
  directMs?: number;
  generateMs?: number;
  totalMs?: number;
};

type BandSessionState = {
  selectedTheme: string | null;
  sessionStatus: SessionStatus;
  activeRequestId: number;
  pendingDirection: string;
  currentDirection: string;
  announcement: Announcement | null;
  isPlaying: boolean;
  audioLevel: number;
  error: string | null;
  shareUnlocked: boolean;
  metrics: Metrics | null;
  setSelectedTheme: (themeId: string) => void;
  setSessionStatus: (status: SessionStatus) => void;
  setActiveRequestId: (requestId: number) => void;
  setPendingDirection: (direction: string) => void;
  setCurrentDirection: (direction: string) => void;
  setAnnouncement: (announcement: Announcement | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setAudioLevel: (audioLevel: number) => void;
  setError: (error: string | null) => void;
  unlockShare: () => void;
  setMetrics: (metrics: Metrics | null) => void;
  resetPerformanceState: () => void;
};

export const useBandSessionStore = create<BandSessionState>((set) => ({
  selectedTheme: null,
  sessionStatus: "theme-picker",
  activeRequestId: 0,
  pendingDirection: "",
  currentDirection: "",
  announcement: null,
  isPlaying: false,
  audioLevel: 0,
  error: null,
  shareUnlocked: false,
  metrics: null,
  setSelectedTheme: (selectedTheme) =>
    set({
      selectedTheme,
      sessionStatus: "pre-show",
      error: null,
      metrics: null,
    }),
  setSessionStatus: (sessionStatus) => set({ sessionStatus }),
  setActiveRequestId: (activeRequestId) => set({ activeRequestId }),
  setPendingDirection: (pendingDirection) => set({ pendingDirection }),
  setCurrentDirection: (currentDirection) => set({ currentDirection }),
  setAnnouncement: (announcement) => set({ announcement }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  setError: (error) => set({ error }),
  unlockShare: () => set({ shareUnlocked: true }),
  setMetrics: (metrics) => set({ metrics }),
  resetPerformanceState: () =>
    set({
      sessionStatus: "pre-show",
      currentDirection: "",
      pendingDirection: "",
      announcement: null,
      isPlaying: false,
      audioLevel: 0,
      error: null,
      shareUnlocked: false,
      metrics: null,
    }),
}));
