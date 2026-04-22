type Props = {
  total: number;
  current: number;
  progress?: number; // 0..1 within current segment
  onSelect?: (index: number) => void;
};

export function ProgressDots({ total, current, progress = 0, onSelect }: Props) {
  return (
    <div className="flex w-full items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const fill =
          i < current ? 100 : i === current ? Math.min(100, progress * 100) : 0;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Ir a escena ${i + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(i);
            }}
            className="pointer-events-auto group flex h-6 flex-1 items-center"
          >
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-cream/30 transition-all group-hover:bg-cream/50">
              <div
                className="h-full bg-cream/90 transition-[width] duration-150 ease-linear"
                style={{ width: `${fill}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
