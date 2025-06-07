"use client";

import { clamp } from "@/lib/math";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { Progress } from "../ui/progress";

const DifficultyBars = ({
  accuracy,
  drain,
}: {
  accuracy: number;
  drain: number;
}) => {
  const easy = useSettingsStore((state) => state.mods.easy);
  const hardRock = useSettingsStore((state) => state.mods.hardRock);

  if (easy) {
    accuracy = accuracy / 2;
    drain = drain / 2;
  } else if (hardRock) {
    accuracy = Math.min(accuracy * 1.4, 10);
    drain = Math.min(drain * 1.4, 10);
  }

  return (
    <div className="mt-2 grid grid-cols-2 gap-4 font-mono">
      <div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Accuracy</span>
          <span
            className={cn(easy && "text-green-400", hardRock && "text-red-400")}
          >
            {accuracy.toFixed(1)}
          </span>
        </div>

        <Progress value={clamp(accuracy, 0, 10) * 10} className="h-1" />
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>HP Drain</span>
          <span
            className={cn(easy && "text-green-400", hardRock && "text-red-400")}
          >
            {drain.toFixed(1)}
          </span>
        </div>

        <Progress value={clamp(drain, 0, 10) * 10} className="h-1 " />
      </div>
    </div>
  );
};

export default DifficultyBars;
