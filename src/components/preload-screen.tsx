import { useEffect, useState } from "react";
import { getPreloadAssets } from "@/lib/experience-config";

type Props = {
  onReady: () => void;
};

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // do not block the experience on a single failure
    img.src = src;
  });
}

function preloadMedia(src: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const el = document.createElement(
        src.endsWith(".mp3") || src.endsWith(".wav") || src.endsWith(".ogg")
          ? "audio"
          : "video",
      ) as HTMLMediaElement;
      el.preload = "auto";
      el.muted = true;
      const done = () => resolve();
      el.oncanplaythrough = done;
      el.onloadeddata = done;
      el.onerror = done; // missing files should not block
      el.src = src;
      // Safety timeout — don't hang on slow networks / missing files
      setTimeout(done, 6000);
    } catch {
      resolve();
    }
  });
}

export function PreloadScreen({ onReady }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const { images, videos, audio } = getPreloadAssets();
    const tasks: Promise<void>[] = [
      ...images.map(preloadImage),
      ...videos.map(preloadMedia),
      preloadMedia(audio),
    ];

    let completed = 0;
    const total = tasks.length;
    tasks.forEach((p) =>
      p.then(() => {
        completed += 1;
        if (!cancelled) setProgress(completed / total);
      }),
    );

    Promise.all(tasks).then(() => {
      if (cancelled) return;
      // Hold the loader briefly so the user perceives the transition
      setTimeout(() => onReady(), 500);
    });

    return () => {
      cancelled = true;
    };
  }, [onReady]);

  const pct = Math.round(progress * 100);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-cream px-8 text-center">
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-foreground/10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="text-primary transition-[stroke-dashoffset] duration-300 ease-out"
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-serif-display text-2xl text-foreground/80">
            {pct}%
          </span>
        </div>
      </div>

      <p className="mt-8 max-w-xs font-serif-display text-xl leading-snug text-foreground/80">
        Preparando un momento especial...
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-foreground/50">
        Un instante, por favor
      </p>
    </div>
  );
}
