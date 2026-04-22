import { useState } from "react";
import { recipients, type Recipient } from "@/lib/experience-config";

type Props = {
  onStart: (r: Recipient) => void;
};

export function WelcomeScreen({ onStart }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = recipients.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden px-6 py-8 sm:px-7 sm:py-10">
      {/* Decorative warm gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_0%,oklch(0.96_0.04_45)_0%,oklch(0.93_0.035_25)_45%,oklch(0.88_0.04_20)_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-50 [background-image:radial-gradient(circle_at_20%_15%,oklch(0.98_0.02_70)_0%,transparent_40%),radial-gradient(circle_at_80%_85%,oklch(0.92_0.06_25)_0%,transparent_45%)]" />

      <div className="mt-4 flex flex-col items-center gap-2 text-center animate-text-rise sm:mt-8">
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-foreground/55">
          Una invitación especial
        </span>
        <div className="mt-3 h-px w-10 bg-foreground/30" />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 px-2 text-center sm:mt-8">
        <h1
          className="font-serif-display text-[1.9rem] leading-[1.1] text-foreground animate-text-rise sm:text-[2rem]"
          style={{ animationDelay: "0.2s" }}
        >
          Tenemos algo<br />muy especial para ti…
        </h1>
        <p
          className="mt-1 max-w-xs text-sm text-foreground/65 animate-text-rise"
          style={{ animationDelay: "0.5s" }}
        >
          Elige tu nombre para comenzar
        </p>
      </div>

      <div
        className="mt-6 flex min-h-0 flex-1 flex-col animate-text-rise sm:mt-8"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="rounded-[1.75rem] bg-cream/45 p-2 ring-1 ring-foreground/10 backdrop-blur-md">
          <div className="max-h-[clamp(240px,38vh,360px)] overflow-y-auto overscroll-contain pr-1 welcome-scroll">
            <div className="flex flex-col gap-2.5">
              {recipients.map((r) => {
                const isActive = r.id === selectedId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className={`w-full rounded-2xl px-5 py-3.5 text-base font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-foreground text-cream shadow-lg scale-[1.01]"
                        : "bg-cream/70 text-foreground/80 ring-1 ring-foreground/10 backdrop-blur hover:bg-cream"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onStart(selected)}
          className={`mt-4 w-full shrink-0 rounded-full px-6 py-4 font-serif-display text-lg tracking-wide transition-all duration-500 sm:mt-5 ${
            selected
              ? "bg-foreground text-cream shadow-xl shadow-foreground/20 hover:scale-[1.02] animate-soft-pulse"
              : "cursor-not-allowed bg-foreground/15 text-foreground/40"
          }`}
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
