import { clamp } from "@/lib/math";
import { cn, getHpOrOdAfterMods } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { Progress } from "../ui/progress";

const DifficultyBars = ({ od, hp }: { od: number; hp: number }) => {
  const mods = useSettingsStore((state) => state.mods);
  const odAfterMods = getHpOrOdAfterMods(od, "od", mods);
  const hpAfterMods = getHpOrOdAfterMods(hp, "hp", mods);

  return (
    <div className="mt-2 grid grid-cols-2 gap-4 font-mono">
      <div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Accuracy</span>
          <span
            className={cn(
              odAfterMods < od && "text-green-400",
              odAfterMods > od && "text-red-400",
            )}
          >
            {odAfterMods.toFixed(1)}
          </span>
        </div>

        <Progress value={clamp(odAfterMods, 0, 10) * 10} className="h-1" />
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>HP Drain</span>
          <span
            className={cn(
              hpAfterMods < hp && "text-green-400",
              hpAfterMods > hp && "text-red-400",
            )}
          >
            {hpAfterMods.toFixed(1)}
          </span>
        </div>

        <Progress value={clamp(hpAfterMods, 0, 10) * 10} className="h-1 " />
      </div>
    </div>
  );
};

export default DifficultyBars;
