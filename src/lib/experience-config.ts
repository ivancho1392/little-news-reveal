// Centralized, easy-to-edit configuration for the reveal experience.
// Replace texts, durations, image paths, videos or audio here without touching components.

import scene1 from "@/assets/images/scene-1.jpg";
import scene2 from "@/assets/images/scene-2.jpg";
import scene3 from "@/assets/images/scene-3.jpg";
import scene4 from "@/assets/images/scene-4.jpg";
import finalBg from "@/assets/images/final-bg.jpeg";

export type Recipient = {
  id: string;
  label: string;
  displayName: string;
  specialText: string;
};

export type Scene = {
  id: string;
  text: string;
  secondaryText?: string;
  image: string; // poster / fallback when no video
  video?: string; // optional background video; falls back to image if missing
  videoAudio?: "muted" | "embedded";
  durationMs: number; // 0 = stays until user action
  variant?: "default" | "ultrasound" | "final";
};

export const audioSrc = "/assets/audio/background-music.mp3";

export const recipients: Recipient[] = [
  {
    id: "alice",
    label: "Alice",
    displayName: "Prima Alice",
    specialText:
      "Estoy en camino para ser tu compañero/a de juegos y compartir muchas aventuras.",
  },
  {
    id: "jenny",
    label: "Jenny",
    displayName: "Tía Jenny",
    specialText: "Estoy en camino para hacer muchas travesuras contigo.",
  },
  {
    id: "lida",
    label: "Lida",
    displayName: "Tía Lida",
    specialText:
      "Estoy en camino para llenarte de alegría y compartir muchas aventuras con Alice.",
  },
  {
    id: "lizeth",
    label: "Lizeth",
    displayName: "Tía Liz",
    specialText:
      "Estoy en camino para robarte muchas sonrisas y crear recuerdos hermosos contigo.",
  },
  {
    id: "stephany",
    label: "Stephany",
    displayName: "Tía Stephany",
    specialText:
      "Estoy en camino para hacerte tía oficialmente y compartir momentos mágicos contigo.",
  },
  {
    id: "emma",
    label: "Emma",
    displayName: "Madrina Emma",
    specialText: "Estoy en camino para llenar tus días de ternura y dulzura.",
  },
  {
    id: "jorge",
    label: "Jorge",
    displayName: "Abuelito Jorge",
    specialText: "Estoy en camino para hacerte sonreir.",
  },
  {
    id: "luz-lopez",
    label: "Luz Lopez",
    displayName: "Abuelita Luz",
    specialText: "Estoy en camino para darte muchos abrazos.",
  },
  {
    id: "luz-poloche",
    label: "Luz Poloche",
    displayName: "Abuelita Luz",
    specialText: "Estoy en camino para alegrar tus días.",
  },
];

// Drop your real videos at these paths and they will be picked up automatically.
// If a file does not exist or fails to load, the matching `image` poster is used.
export const sceneVideos = {
  scene1: "/assets/videos/scene-1.mp4",
  scene3: "/assets/videos/scene-3.mp4",
  scene4: "/assets/videos/scene-4.mp4",
};

// {{nombreSeleccionado}} will be replaced at runtime
export const scenes: Scene[] = [
  {
    id: "scene-1",
    text: "El 2026 viene con algo especial.",
    image: scene1,
    video: sceneVideos.scene1,
    videoAudio: "muted",
    durationMs: 6000,
  },
  {
    id: "scene-2",
    text: "El año del caballo chino, símbolo de fuerza, libertad y nuevas aventuras.",
    image: scene2,
    durationMs: 8000,
  },
  {
    id: "scene-3",
    text: "Y mientras todo comienza a tomar forma...",
    image: scene3,
    video: sceneVideos.scene3,
    videoAudio: "muted",
    durationMs: 5000,
  },
  {
    id: "scene-4",
    text: "Dentro de mi mami ahora laten dos corazones...",
    image: scene4,
    video: sceneVideos.scene4,
    videoAudio: "embedded",
    durationMs: 10000,
  },
  {
    id: "scene-5",
    text: "",
    image: "/assets/images/ultrasound.jpeg",
    durationMs: 7000,
    variant: "ultrasound",
  },
  {
    id: "scene-final",
    text: "Muy pronto nos conoceremos.",
    image: finalBg,
    durationMs: 0,
    variant: "final",
  },
];

export function interpolate(text: string, name: string) {
  return text.replace(/\{\{nombreSeleccionado\}\}/g, name);
}

export function resolveSceneText(scene: Scene, recipient: Recipient) {
  if (scene.id === "scene-5") {
    return `${recipient.specialText} ${recipient.displayName}`;
  }

  return interpolate(scene.text, recipient.displayName);
}

// Assets to preload before starting the experience
export function getPreloadAssets(): { images: string[]; videos: string[]; audio: string } {
  const images = scenes.map((s) => s.image);
  const videos = scenes.map((s) => s.video).filter((v): v is string => Boolean(v));
  return { images, videos, audio: audioSrc };
}
