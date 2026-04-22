import { useCallback, useEffect, useRef, useState } from "react";
import { audioSrc } from "@/lib/experience-config";

type FadeOptions = {
  durationMs?: number;
};

const DEFAULT_VOLUME = 0.34;

// Single background music controller for the whole experience.
export function useBackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number>(0);
  const targetVolumeRef = useRef(DEFAULT_VOLUME);
  const startedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      cancelAnimationFrame(fadeRef.current);
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  const fadeTo = useCallback((nextVolume: number, durationMs = 1200) => {
    const audio = audioRef.current;
    if (!audio) return;

    cancelAnimationFrame(fadeRef.current);
    const start = audio.volume;
    const startTs = performance.now();

    if (durationMs <= 0) {
      audio.volume = nextVolume;
      return;
    }

    const tick = (t: number) => {
      const p = Math.min(1, (t - startTs) / durationMs);
      const v = start + (nextVolume - start) * p;
      audio.volume = Math.max(0, Math.min(1, v));
      if (p < 1) {
        fadeRef.current = requestAnimationFrame(tick);
      }
    };

    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  const applyTargetVolume = useCallback(
    ({ durationMs = 1200 }: FadeOptions = {}) => {
      const audio = audioRef.current;
      if (!audio || !startedRef.current) return;

      if (audio.paused) {
        audio.play().catch(() => {
          /* autoplay may be blocked silently */
        });
      }

      fadeTo(muted ? 0 : targetVolumeRef.current, durationMs);
    },
    [fadeTo, muted],
  );

  const start = useCallback(
    ({ initialVolume = DEFAULT_VOLUME, fadeMs = 1600 } = {}) => {
      const audio = audioRef.current;
      if (!audio) return;

      startedRef.current = true;
      targetVolumeRef.current = initialVolume;
      audio.currentTime = 0;
      audio.volume = 0;
      audio.play().catch(() => {
        /* autoplay may be blocked silently */
      });
      fadeTo(muted ? 0 : initialVolume, fadeMs);
    },
    [fadeTo, muted],
  );

  const setTargetVolume = useCallback(
    (nextVolume: number, { durationMs = 1200 }: FadeOptions = {}) => {
      targetVolumeRef.current = Math.max(0, Math.min(1, nextVolume));
      applyTargetVolume({ durationMs });
    },
    [applyTargetVolume],
  );

  const reset = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    cancelAnimationFrame(fadeRef.current);
    startedRef.current = false;
    targetVolumeRef.current = DEFAULT_VOLUME;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0;
  }, []);

  useEffect(() => {
    applyTargetVolume({ durationMs: 250 });
  }, [applyTargetVolume, muted]);

  return {
    muted,
    toggleMuted: () => setMuted((m) => !m),
    reset,
    setTargetVolume,
    start,
  };
}
