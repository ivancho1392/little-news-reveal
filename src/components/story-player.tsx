import { useEffect, useRef, useState } from "react";
import { scenes, type Recipient } from "@/lib/experience-config";
import { StoryScene } from "./story-scene";
import { ProgressDots } from "./progress-dots";
import { AudioControl } from "./audio-control";
import { useBackgroundAudio } from "./use-background-audio";
import { ReplayButton } from "./replay-button";
import { PlaybackControls } from "./playback-controls";

type Props = {
  recipient: Recipient;
  onReplay: () => void;
  backgroundAudio: ReturnType<typeof useBackgroundAudio>;
};

export function StoryPlayer({ recipient, onReplay, backgroundAudio }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const scene = scenes[index];
  const isLast = index === scenes.length - 1;

  // The background music stays soft, gives way to scene 4's embedded audio,
  // and returns from scene 5 onward.
  const intensity = 0.3 + (index / Math.max(1, scenes.length - 1)) * 0.4;
  const backgroundTargetVolume = scene.id === "scene-4" ? 0 : intensity;
  const { muted, toggleMuted, setTargetVolume } = backgroundAudio;

  // Auto-advance with progress tracking + pause support
  const startedAtRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    // Reset progress when scene changes
    elapsedRef.current = 0;
    setProgress(0);
  }, [index]);

  useEffect(() => {
    setTargetVolume(backgroundTargetVolume, {
      durationMs: scene.id === "scene-4" ? 1000 : 1600,
    });
  }, [backgroundTargetVolume, scene.id, setTargetVolume]);

  useEffect(() => {
    if (!scene.durationMs) return;
    if (paused) return;

    startedAtRef.current = performance.now() - elapsedRef.current;
    let raf = 0;

    const tick = (t: number) => {
      const elapsed = t - startedAtRef.current;
      elapsedRef.current = elapsed;
      const p = Math.min(1, elapsed / scene.durationMs);
      setProgress(p);
      if (p >= 1) {
        setIndex((i) => Math.min(i + 1, scenes.length - 1));
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, scene.durationMs, paused]);

  const advance = () => {
    if (!isLast) setIndex((i) => i + 1);
  };

  const goBack = () => {
    setIndex((i) => Math.max(0, i - 1));
  };

  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(scenes.length - 1, i)));
  };

  return (
    <div
      className="relative h-full w-full cursor-pointer select-none bg-foreground"
      onClick={advance}
    >
      <StoryScene
        scene={scene}
        recipient={recipient}
        sceneKey={scene.id}
        paused={paused}
        globalMuted={muted}
      />

      {/* Top bar: progress */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-5 pt-5">
        <ProgressDots
          total={scenes.length}
          current={index}
          progress={progress}
          onSelect={goTo}
        />
      </div>

      {/* Controls bar below progress */}
      <div className="absolute inset-x-0 top-10 z-20 flex items-center justify-between px-5 pt-2">
        <div onClick={(e) => e.stopPropagation()}>
          <PlaybackControls
            paused={paused}
            onTogglePause={() => setPaused((p) => !p)}
            onBack={goBack}
            canGoBack={index > 0}
          />
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <AudioControl muted={muted} onToggle={toggleMuted} />
        </div>
      </div>

      {/* Replay button on final scene */}
      {isLast && (
        <div
          className="absolute inset-x-0 bottom-10 z-20 flex justify-center"
          style={{ animation: "text-rise 1s ease-out 2.6s both" }}
        >
          <ReplayButton onClick={onReplay} />
        </div>
      )}
    </div>
  );
}
