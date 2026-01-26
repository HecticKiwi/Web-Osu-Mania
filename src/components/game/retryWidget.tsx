import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "../../stores/settingsStore";

const retryTime = 500;

function RetryWidget({ retry }: { retry: () => void }) {
  const keybinds = useSettingsStore.use.keybinds();
  const [holdDuration, setHoldDuration] = useState(0);
  const holdStartRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateHoldDuration = () => {
      if (holdStartRef.current) {
        const elapsed = performance.now() - holdStartRef.current;
        setHoldDuration(elapsed);

        if (elapsed >= retryTime) {
          retry();
          holdStartRef.current = null;
          setHoldDuration(0);

          return;
        }

        animationFrameRef.current = requestAnimationFrame(updateHoldDuration);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === keybinds.retry && !event.repeat) {
        holdStartRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(updateHoldDuration);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === keybinds.retry) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        holdStartRef.current = null;
        setHoldDuration(0);
      }
    };

    addEventListener("keydown", handleKeyDown);
    addEventListener("keyup", handleKeyUp);

    return () => {
      removeEventListener("keydown", handleKeyDown);
      removeEventListener("keyup", handleKeyUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [retry, keybinds.retry]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-[50px] left-[50px] z-20 w-[200px] rounded-lg border bg-background p-4 opacity-0 transition",
        holdDuration > 0 && "pointer-events-auto opacity-100",
      )}
    >
      <p className="mb-1 text-muted-foreground">Retrying...</p>
      <Progress value={(holdDuration / retryTime) * 100} className="h-2" />
    </div>
  );
}

export default RetryWidget;
