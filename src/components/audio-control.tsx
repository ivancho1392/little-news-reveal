import { Volume2, VolumeX } from "lucide-react";

type Props = {
  muted: boolean;
  onToggle: () => void;
};

export function AudioControl({ muted, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={muted ? "Activar sonido" : "Silenciar"}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-background/40 text-foreground backdrop-blur-md ring-1 ring-foreground/10 transition hover:bg-background/60"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
