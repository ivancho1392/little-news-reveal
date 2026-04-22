// Centralized, easy-to-edit configuration for the reveal experience.
// Replace texts, durations, image paths or audio here without touching components.

import scene1 from "@/assets/images/scene-1.jpg";
import scene2 from "@/assets/images/scene-2.jpg";
import scene3 from "@/assets/images/scene-3.jpg";
import scene4 from "@/assets/images/scene-4.jpg";
import ultrasound from "@/assets/images/ultrasound.jpg";
import finalBg from "@/assets/images/final-bg.jpg";

export type Recipient = {
  id: string;
  label: string;
  displayName: string;
};

export type Scene = {
  id: string;
  text: string;
  secondaryText?: string;
  image: string;
  durationMs: number; // 0 = stays until user action
  variant?: "default" | "ultrasound" | "final";
};

export const audioSrc = "/assets/audio/background-music.mp3";

export const recipients: Recipient[] = [
  { id: "tia-ana", label: "Jenny Puyo", displayName: "Tía Jenny" },
  { id: "tio-carlos", label: "Lida Puyo", displayName: "Tía Lida" },
  { id: "prima-sofia", label: "Lizeth Puyo", displayName: "Tia Liz" },
];

// {{nombreSeleccionado}} will be replaced at runtime
export const scenes: Scene[] = [
  {
    id: "scene-1",
    text: "El 2026 viene con algo especial.",
    image: scene1,
    durationMs: 5000,
  },
  {
    id: "scene-2",
    text: "El año del caballo chino, símbolo de fuerza, libertad y nuevas aventuras.",
    image: scene2,
    durationMs: 5000,
  },
  {
    id: "scene-3",
    text: "Y mientras todo comienza a tomar forma...",
    image: scene3,
    durationMs: 5000,
  },
  {
    id: "scene-4",
    text: "Dentro de mi mami ahora laten dos corazones...",
    image: scene4,
    durationMs: 5000,
  },
  {
    id: "scene-5",
    text: "Estoy en camino, {{nombreSeleccionado}}.",
    image: ultrasound,
    durationMs: 5000,
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
