import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getNestedProperty, setNestedProperty } from "@/lib/utils";
import type { Settings } from "@/stores/settingsStore";
import { defaultSettings, useSettingsStore } from "@/stores/settingsStore";
import { RotateCcw } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

const SwitchInput = ({
  label,
  tooltip,
  settingPath,
  selector,
  extraInput,
  containerClassName,
  hideReset,
  ...props
}: {
  label: string;
  tooltip?: string | ((value: any) => string);
  settingPath?: keyof Settings | (string & {});
  selector?: (settings: Settings) => boolean;
  extraInput?: ReactNode;
  containerClassName?: string;
  hideReset?: boolean;
} & ComponentProps<typeof Switch>) => {
  const setSettings = useSettingsStore.use.setSettings();

  // Use selector if provided, otherwise use settingPath
  const value = selector
    ? // eslint-disable-next-line
      useSettingsStore(selector)
    : // eslint-disable-next-line
      useSettingsStore((state) => getNestedProperty(state, settingPath!));

  // Only calculate default value and show reset if settingPath is provided and hideReset is false
  const showReset = settingPath && !hideReset;
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
      <div className={cn("grid grid-cols-2 items-center", containerClassName)}>
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

        <div className="flex gap-3">
          {tooltip ? (
            <div className="group w-fit">
              <Tooltip open>
                <TooltipTrigger asChild>
                  <div>
                    <Switch className="block" checked={value} {...props} />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="hidden px-3 py-1.5 group-focus-within:block group-hover:block">
                  <p>
                    {typeof tooltip === "function" ? tooltip(value) : tooltip}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <Switch checked={value} className="block" {...props} />
          )}

          {extraInput}
        </div>
      </div>
    </>
  );
};

export default SwitchInput;
