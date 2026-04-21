import type { Scene } from "@/lib/experience-config";
import { interpolate } from "@/lib/experience-config";

type Props = {
  scene: Scene;
  recipientName: string;
  sceneKey: string; // forces remount + re-animation
};

export function StoryScene({ scene, recipientName, sceneKey }: Props) {
  const text = interpolate(scene.text, recipientName);
  const isUltrasound = scene.variant === "ultrasound";
  const isFinal = scene.variant === "final";

  return (
    <div key={sceneKey} className="absolute inset-0 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 animate-scene-fade-in">
        <div
          className={`absolute inset-0 bg-cover bg-center ${
            isUltrasound ? "" : "animate-ken-burns"
          }`}
          style={{ backgroundImage: `url(${scene.image})` }}
        />
        {/* Soft overlay for legibility */}
        <div
          className={`absolute inset-0 ${
            isUltrasound
              ? "bg-gradient-to-b from-cream/30 via-cream/10 to-cream/70"
              : "bg-gradient-to-b from-foreground/10 via-foreground/5 to-foreground/40"
          }`}
        />
      </div>

      {/* Text content */}
      <div className="relative flex h-full w-full flex-col items-center justify-end px-8 pb-24 text-center">
        {isUltrasound ? (
          <p
            className="animate-text-rise font-serif-display text-3xl leading-snug text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
            style={{ animationDelay: "0.4s" }}
          >
            {text}
          </p>
        ) : isFinal ? (
          <div className="space-y-6">
            <p
              className="animate-text-rise font-serif-display text-3xl leading-snug text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
              style={{ animationDelay: "0.3s" }}
            >
              {text}
            </p>
            <p
              className="animate-text-rise font-serif-display text-5xl italic tracking-wide text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
              style={{ animationDelay: "1.4s" }}
            >
              {scene.secondaryText}
            </p>
          </div>
        ) : (
          <p
            className="animate-text-rise font-serif-display text-2xl leading-snug text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-3xl"
            style={{ animationDelay: "0.4s" }}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
