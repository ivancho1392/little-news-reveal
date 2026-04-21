import { RotateCcw } from "lucide-react";

export function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-2 rounded-full bg-cream/90 px-5 py-2.5 text-sm font-medium text-foreground shadow-lg ring-1 ring-foreground/10 backdrop-blur transition hover:bg-cream"
    >
      <RotateCcw className="h-3.5 w-3.5" />
      Volver a verlo
    </button>
  );
}
