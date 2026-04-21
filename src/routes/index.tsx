import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { StoryPlayer } from "@/components/story-player";
import type { Recipient } from "@/lib/experience-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Una sorpresa muy especial para ti" },
      {
        name: "description",
        content:
          "Una experiencia íntima y emocional para conocer una noticia que cambiará todo.",
      },
      { property: "og:title", content: "Una sorpresa muy especial para ti" },
      {
        property: "og:description",
        content: "Toca el enlace, elige tu nombre y vive el momento.",
      },
    ],
  }),
  component: Index,
});

type Phase = "welcome" | "story";

function Index() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [recipient, setRecipient] = useState<Recipient | null>(null);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-0 sm:p-6">
      {/* Phone-like vertical container — 9:16 on desktop */}
      <div
        className="relative w-full overflow-hidden bg-cream shadow-2xl shadow-foreground/20 sm:w-[420px] sm:rounded-[2.25rem] sm:ring-1 sm:ring-foreground/10"
        style={{
          height: "100svh",
          maxHeight: "calc(100svh - 0px)",
        }}
      >
        <div
          className="absolute inset-0 sm:!h-auto"
          style={{
            // On desktop force a 9:16 aspect inside the centered phone frame
          }}
        />
        <div
          className="relative h-full w-full sm:!h-[calc(420px*16/9)]"
        >
          {phase === "welcome" && (
            <WelcomeScreen
              onStart={(r) => {
                setRecipient(r);
                setPhase("story");
              }}
            />
          )}
          {phase === "story" && recipient && (
            <StoryPlayer
              recipientName={recipient.displayName}
              onReplay={() => {
                setPhase("welcome");
                setRecipient(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
