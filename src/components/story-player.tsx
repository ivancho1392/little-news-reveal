import { useEffect, useState } from "react";
import { scenes } from "@/lib/experience-config";
import { StoryScene } from "./story-scene";
import { ProgressDots } from "./progress-dots";
import { AudioControl } from "./audio-control";
import { useBackgroundAudio } from "./use-background-audio";
import { ReplayButton } from "./replay-button";

type Props = {
  recipientName: string;
  onReplay: () => void;
};

export function StoryPlayer({ recipientName, onReplay }: Props) {
  const [index, setIndex] = useState(0);
  const scene = scenes[index];
  const isLast = index === scenes.length - 1;

  // Audio intensity rises towards the final scene
  const intensity = 0.3 + (index / Math.max(1, scenes.length - 1)) * 0.4;
  const { muted, toggleMuted } = useBackgroundAudio({ active: true, intensity });

  // Auto-advance based on scene duration
  useEffect(() => {
    if (!scene.durationMs) return;
    const t = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, scenes.length - 1));
    }, scene.durationMs);
    return () => clearTimeout(t);
  }, [index, scene.durationMs]);

  const advance = () => {
    if (!isLast) setIndex((i) => i + 1);
  };

  return (
    <div
      className="relative h-full w-full cursor-pointer select-none bg-foreground"
      onClick={advance}
    >
      <StoryScene
        scene={scene}
        recipientName={recipientName}
        sceneKey={scene.id}
      />

      {/* Top bar: progress + audio */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-3 px-5 pt-5">
        <div className="flex-1">
          <ProgressDots total={scenes.length} current={index} />
        </div>
        <div className="pointer-events-auto">
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
