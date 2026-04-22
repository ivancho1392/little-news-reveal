import { useEffect, useState } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { StoryPlayer } from "@/components/story-player";
import { PreloadScreen } from "@/components/preload-screen";
import type { Recipient } from "@/lib/experience-config";

type Phase = "welcome" | "loading" | "story";

export default function App() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [recipient, setRecipient] = useState<Recipient | null>(null);

  useEffect(() => {
    document.title = "Una sorpresa muy especial para ti";
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-0 sm:p-6">
      <div
        className="relative w-full overflow-hidden bg-cream shadow-2xl shadow-foreground/30 sm:w-[min(420px,calc(100svh*9/16))] sm:rounded-[2.25rem] sm:ring-1 sm:ring-foreground/10"
        style={{ height: "100svh" }}
      >
        <div className="relative h-full w-full">
          {phase === "welcome" && (
            <WelcomeScreen
              onStart={(nextRecipient) => {
                setRecipient(nextRecipient);
                setPhase("loading");
              }}
            />
          )}
          {phase === "loading" && (
            <PreloadScreen onReady={() => setPhase("story")} />
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
