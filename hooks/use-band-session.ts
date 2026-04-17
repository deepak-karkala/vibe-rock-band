"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MusicDirectionResponse } from "@/lib/contracts";
import { useBandSessionStore } from "@/stores/band-session-store";

const duplicateKey = (themeId: string | null, direction: string) =>
  `${themeId ?? "none"}::${direction.trim().toLowerCase()}`;

export function useBandSession(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const {
    selectedTheme,
    activeRequestId,
    setActiveRequestId,
    setPendingDirection,
    setCurrentDirection,
    setAnnouncement,
    setSessionStatus,
    setError,
    unlockShare,
    setMetrics,
    setIsPlaying,
    setAudioLevel,
  } = useBandSessionStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentObjectUrlRef = useRef<string | null>(null);
  const duplicateSubmissionRef = useRef("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const cleanupAudioUrl = useCallback(() => {
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = null;
    }
  }, []);

  const startAudioAnalysis = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!audioContextRef.current) {
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      audioContextRef.current = context;
      analyserRef.current = analyser;
      mediaSourceRef.current = source;
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);

    const tick = () => {
      analyserRef.current?.getByteFrequencyData(dataArray);
      const energy =
        dataArray.reduce((total, value) => total + value, 0) /
        Math.max(1, dataArray.length) /
        255;
      setAudioLevel(energy);
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  }, [audioRef, setAudioLevel]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const onPlay = () => {
      setIsPlaying(true);
      setSessionStatus("playing");
      unlockShare();
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setAudioLevel(0);
    };
    const onWaiting = () => setSessionStatus("pending");
    const onCanPlay = () => {
      if (!audio.paused) {
        setSessionStatus("playing");
      }
    };
    const onError = () => {
      setIsPlaying(false);
      setSessionStatus("error");
      setError("The band's having trouble getting the next clip on stage.");
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  }, [
    audioRef,
    setAudioLevel,
    setError,
    setIsPlaying,
    setSessionStatus,
    unlockShare,
  ]);

  useEffect(() => {
    return () => {
      cleanupAudioUrl();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      analyserRef.current?.disconnect();
      mediaSourceRef.current?.disconnect();
      audioContextRef.current?.close();
    };
  }, [cleanupAudioUrl]);

  const submitDirection = useCallback(
    async (direction: string) => {
      if (!selectedTheme) {
        return;
      }

      const trimmedDirection = direction.trim();
      if (!trimmedDirection) {
        return;
      }

      const nextDuplicateKey = duplicateKey(selectedTheme, trimmedDirection);
      if (duplicateSubmissionRef.current === nextDuplicateKey && !isSubmitting) {
        return;
      }

      duplicateSubmissionRef.current = nextDuplicateKey;
      const requestId = activeRequestId + 1;
      setActiveRequestId(requestId);
      setPendingDirection(trimmedDirection);
      setSessionStatus("pending");
      setError(null);
      setIsSubmitting(true);

      const overallStart = performance.now();
      performance.mark(`request:${requestId}:start`);

      try {
        const directStart = performance.now();
        const directResponse = await fetch("/api/music/direct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            themeId: selectedTheme,
            direction: trimmedDirection,
          }),
        });

        if (!directResponse.ok) {
          throw new Error("The band director missed the cue.");
        }

        const directData = (await directResponse.json()) as MusicDirectionResponse;
        const directMs = performance.now() - directStart;

        if (useBandSessionStore.getState().activeRequestId !== requestId) {
          return;
        }

        setAnnouncement(directData.announcement);

        const generateStart = performance.now();
        const audioResponse = await fetch("/api/music/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompts: directData.prompts,
            bpm: directData.bpm,
            temperature: directData.temperature,
          }),
        });

        if (!audioResponse.ok) {
          throw new Error("The band couldn't get the clip onto the stage.");
        }

        const blob = await audioResponse.blob();
        const generateMs = performance.now() - generateStart;

        if (useBandSessionStore.getState().activeRequestId !== requestId) {
          return;
        }

        const audio = audioRef.current;
        if (!audio) {
          throw new Error("Audio element missing.");
        }

        await startAudioAnalysis();
        cleanupAudioUrl();

        const objectUrl = URL.createObjectURL(blob);
        currentObjectUrlRef.current = objectUrl;

        const originalVolume = audio.volume || 1;
        audio.volume = originalVolume;

        if (!audio.paused) {
          audio.volume = 0;
          audio.pause();
        }

        audio.src = objectUrl;
        audio.load();
        await audio.play();

        let frame = 0;
        const fadeIn = () => {
          frame += 1;
          audio.volume = Math.min(originalVolume, frame / 12);
          if (audio.volume < originalVolume) {
            requestAnimationFrame(fadeIn);
          }
        };
        requestAnimationFrame(fadeIn);

        setCurrentDirection(trimmedDirection);
        setPendingDirection("");
        setMetrics({
          directMs: Math.round(directMs),
          generateMs: Math.round(generateMs),
          totalMs: Math.round(performance.now() - overallStart),
        });
      } catch (error) {
        if (useBandSessionStore.getState().activeRequestId !== requestId) {
          return;
        }

        setSessionStatus("error");
        setError(
          error instanceof Error
            ? error.message
            : "The band lost the thread. Try another direction.",
        );
      } finally {
        if (useBandSessionStore.getState().activeRequestId === requestId) {
          setIsSubmitting(false);
        }
      }
    },
    [
      activeRequestId,
      audioRef,
      cleanupAudioUrl,
      isSubmitting,
      selectedTheme,
      setActiveRequestId,
      setAnnouncement,
      setCurrentDirection,
      setError,
      setMetrics,
      setPendingDirection,
      setSessionStatus,
      startAudioAnalysis,
    ],
  );

  return {
    isSubmitting,
    submitDirection,
  };
}
