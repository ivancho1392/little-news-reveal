import { useEffect, useRef, useState } from "react";
import type { Recipient, Scene } from "@/lib/experience-config";
import { resolveSceneText } from "@/lib/experience-config";

type Props = {
  scene: Scene;
  recipient: Recipient;
  sceneKey: string; // forces remount + re-animation
  paused?: boolean;
  globalMuted?: boolean;
};

export function StoryScene({
  scene,
  recipient,
  sceneKey,
  paused,
  globalMuted = false,
}: Props) {
  const text = resolveSceneText(scene, recipient);
  const isUltrasound = scene.variant === "ultrasound";
  const isFinal = scene.variant === "final";
  const useGlassTextPanel = scene.id === "scene-3" || scene.id === "scene-5";
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const useVideo = Boolean(scene.video) && !videoFailed;
  const useEmbeddedVideoAudio = scene.videoAudio === "embedded";
  const videoMuted = globalMuted || !useEmbeddedVideoAudio;

  useEffect(() => {
    setVideoFailed(false);
    setVideoReady(false);
  }, [sceneKey]);

  // Pause/resume the video alongside the global playback state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = videoMuted;
    v.volume = videoMuted ? 0 : 1;

    if (paused) {
      v.pause();
    } else {
      v.play().catch(() => {
        /* autoplay can be blocked silently */
      });
    }
  }, [paused, videoMuted, sceneKey]);

  return (
    <div key={sceneKey} className="absolute inset-0 overflow-hidden">
      {/* Background media */}
      <div className="absolute inset-0 animate-scene-fade-in">
        {isUltrasound && !useVideo ? (
          <>
            {/* Warm backdrop behind the ultrasound so it never looks empty */}
            <div className="absolute inset-0 bg-foreground" />
            {/* Ultrasound shown fully (contain) so the baby is always visible */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${scene.image})` }}
            />
          </>
        ) : useVideo ? (
          <>
            <div className="absolute inset-0 bg-foreground" />
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              src={scene.video}
              autoPlay
              muted={videoMuted}
              playsInline
              loop={!useEmbeddedVideoAudio}
              preload="auto"
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onError={() => {
                setVideoReady(false);
                setVideoFailed(true);
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center animate-ken-burns"
            style={{ backgroundImage: `url(${scene.image})` }}
          />
        )}
        {/* Soft overlay for legibility */}
        <div
          className={`absolute inset-0 ${
            isUltrasound && !useVideo
              ? "bg-gradient-to-b from-transparent via-transparent to-foreground/80"
              : "bg-gradient-to-b from-foreground/10 via-foreground/5 to-foreground/55"
          }`}
        />
      </div>

      {/* Text content */}
      <div className="relative flex h-full w-full flex-col items-center justify-end px-8 pb-24 text-center">
        {isUltrasound ? (
          <p
            className={`animate-text-rise font-serif-display text-3xl leading-snug text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] ${
              useGlassTextPanel
                ? "mx-auto max-w-[18rem] rounded-2xl border border-white/12 bg-black/35 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md"
                : ""
            }`}
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
            {scene.secondaryText && (
              <p
                className="animate-text-rise font-serif-display text-5xl italic tracking-wide text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                style={{ animationDelay: "1.4s" }}
              >
                {scene.secondaryText}
              </p>
            )}
          </div>
        ) : (
          <p
            className={`animate-text-rise font-serif-display text-2xl leading-snug text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-3xl ${
              useGlassTextPanel
                ? "mx-auto max-w-[19rem] rounded-2xl border border-white/12 bg-black/35 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md"
                : ""
            }`}
            style={{ animationDelay: "0.4s" }}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
