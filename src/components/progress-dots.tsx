type Props = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex w-full items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-[2px] flex-1 overflow-hidden rounded-full bg-foreground/15"
        >
          <div
            className="h-full bg-foreground/70 transition-all duration-500 ease-out"
            style={{
              width: i < current ? "100%" : i === current ? "100%" : "0%",
              opacity: i === current ? 0.85 : i < current ? 0.6 : 0,
            }}
          />
        </div>
      ))}
    </div>
  );
}
