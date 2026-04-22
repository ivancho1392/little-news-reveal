import { ChevronLeft, Pause, Play } from "lucide-react";

type Props = {
  paused: boolean;
  onTogglePause: () => void;
  onBack: () => void;
  canGoBack: boolean;
};

export function PlaybackControls({
  paused,
  onTogglePause,
  onBack,
  canGoBack,
}: Props) {
  const baseBtn =
    "flex h-10 w-10 items-center justify-center rounded-full bg-background/40 text-foreground backdrop-blur-md ring-1 ring-foreground/10 transition hover:bg-background/60 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onBack();
        }}
        disabled={!canGoBack}
        aria-label="Vista anterior"
        className={baseBtn}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePause();
        }}
        aria-label={paused ? "Reanudar" : "Pausar"}
        className={baseBtn}
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
    </div>
  );
}
