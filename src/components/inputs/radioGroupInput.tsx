import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getNestedProperty, setNestedProperty } from "@/lib/utils";
import type { Settings } from "@/stores/settingsStore";
import { defaultSettings, useSettingsStore } from "@/stores/settingsStore";
import { RotateCcw } from "lucide-react";
import type { ComponentProps } from "react";
import { RadioGroup } from "../ui/radio-group";

const RadioGroupInput = ({
  label,
  settingPath,
  selector,
  ...props
}: {
  label: string;
  settingPath?: keyof Settings | (string & {});
  selector?: (settings: Settings) => string;
} & ComponentProps<typeof RadioGroup>) => {
  // Use selector if provided, otherwise use settingPath
  // When using settingPath, convert the value to string for the RadioGroup component
  const rawValue = selector
    ? // eslint-disable-next-line
      useSettingsStore(selector)
    : // eslint-disable-next-line
      useSettingsStore((state) => getNestedProperty(state, settingPath!));
  const value = selector ? rawValue : String(rawValue ?? "");

  const setSettings = useSettingsStore.use.setSettings();

  // Only calculate default value and show reset if settingPath is provided
  const showReset = settingPath;
  const defaultValue = showReset
    ? getNestedProperty(defaultSettings, settingPath)
    : undefined;
  const currentValueForReset = showReset
    ? getNestedProperty(useSettingsStore.getState(), settingPath)
    : undefined;

  const handleReset = () => {
    if (settingPath && defaultValue !== undefined) {
      setSettings((draft) => {
        setNestedProperty(draft, settingPath, defaultValue);
      });
    }
  };

  return (
    <>
      <div className={cn("grid grid-cols-2")}>
        <div className="text-muted-foreground pr-2 text-sm font-semibold">
          {label}
          {showReset &&
            defaultValue !== undefined &&
            currentValueForReset !== undefined &&
            defaultValue !== currentValueForReset && (
              <>
                {" "}
                <Tooltip delayDuration={0}>
                  <TooltipTrigger onClick={handleReset}>
                    <RotateCcw className="text-primary inline size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Revert to Default</TooltipContent>
                </Tooltip>
              </>
            )}
        </div>

        <RadioGroup value={value} {...props} />
      </div>
    </>
  );
};

export default RadioGroupInput;
