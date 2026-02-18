import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Settings } from "@/stores/settingsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { ComponentProps, ReactNode } from "react";

const SwitchInput = ({
  label,
  tooltip,
  selector,
  extraInput,
  ...props
}: {
  label: string;
  tooltip?: string | ((value: any) => string);
  selector: (settings: Settings) => boolean;
  extraInput?: ReactNode;
} & ComponentProps<typeof Switch>) => {
  const value = useSettingsStore(selector);

  return (
    <>
      <div className="grid grid-cols-2 items-center">
        <div className="text-muted-foreground pr-2 text-sm font-semibold">
          {label}
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
