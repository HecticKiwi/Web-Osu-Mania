"use client";

import { cn, getScoreMultiplier } from "@/lib/utils";
import { useSettingsStore } from "../../stores/settingsStore";

const ScoreMultiplier = () => {
  const mods = useSettingsStore.use.mods();

  const multiplier = getScoreMultiplier(mods);

  return (
    <h3 className="mx-auto mb-4 w-fit rounded-full border px-3 py-2 text-center text-sm">
      Score Multiplier:{" "}
      <span className={cn(multiplier < 1 && "text-green-400")}>
        {multiplier.toFixed(2)}x
      </span>
    </h3>
  );
};

export default ScoreMultiplier;
