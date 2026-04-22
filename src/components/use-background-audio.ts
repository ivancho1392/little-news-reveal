import { useEffect, useRef, useState } from "react";
import { audioSrc } from "@/lib/experience-config";

type Props = {
  active: boolean;
  intensity?: number; // 0..1 volume target
};

// Custom hook returning controls for the small mute/unmute UI button.
export function useBackgroundAudio({ active, intensity = 0.4 }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    setReady(true);
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Fade in when activated
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !active) return;
    audio.muted = muted;
    audio.play().catch(() => {
      /* autoplay may be blocked silently */
    });
    const target = muted ? 0 : intensity;
    const start = audio.volume;
    const duration = 3000;
    const startTs = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTs) / duration);
      const v = start + (target - start) * p;
      audio.volume = Math.max(0, Math.min(1, v));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, intensity, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
  }, [muted]);

  return {
    muted,
    toggleMuted: () => setMuted((m) => !m),
    ready,
  };
}
