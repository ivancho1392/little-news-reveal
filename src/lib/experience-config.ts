// Centralized, easy-to-edit configuration for the reveal experience.
// Replace texts, durations, image paths or audio here without touching components.

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
    image: "/assets/images/scene-1.jpg",
    durationMs: 3000,
  },
  {
    id: "scene-2",
    text: "El año del caballo chino, símbolo de fuerza, libertad y nuevas aventuras.",
    image: "/assets/images/scene-2.jpg",
    durationMs: 3500,
  },
  {
    id: "scene-3",
    text: "Y mientras todo comienza a tomar forma...",
    image: "/assets/images/scene-3.jpg",
    durationMs: 3000,
  },
  {
    id: "scene-4",
    text: "Dentro de mi mami ahora laten dos corazones...",
    image: "/assets/images/scene-4.jpg",
    durationMs: 4500,
  },
  {
    id: "scene-5",
    text: "Estoy en camino, {{nombreSeleccionado}}.",
    image: "/assets/images/ultrasound.jpg",
    durationMs: 4000,
    variant: "ultrasound",
  },
  {
    id: "scene-final",
    text: "Muy pronto nos conoceremos.",
    secondaryText: "En diciembre.",
    image: "/assets/images/final-bg.jpg",
    durationMs: 0,
    variant: "final",
  },
];

export function interpolate(text: string, name: string) {
  return text.replace(/\{\{nombreSeleccionado\}\}/g, name);
}
