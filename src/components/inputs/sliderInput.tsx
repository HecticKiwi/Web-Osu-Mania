"use client";

import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Settings, useSettingsStore } from "@/stores/settingsStore";
import { ComponentProps, ReactNode, useState } from "react";

const SliderInput = ({
  label,
  selector,
  tooltip,
  graphic,
  inWidget,
  containerClassName,
  ...props
}: {
  label?: string;
  selector: (settings: Settings) => number;
  tooltip?: string | ((value: any) => string);
  graphic?: (value: any) => ReactNode;
  inWidget?: boolean;
  containerClassName?: string;
} & ComponentProps<typeof Slider>) => {
  const value = useSettingsStore(selector);
  const [isActive, setIsActive] = useState(false);

  const handlePointerDown = () => setIsActive(true);
  const handlePointerUp = () => setIsActive(false);

  const slider = (
    <Slider
      value={[value]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      {...props}
    />
  );

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 items-center",
          inWidget && "grid-cols-3",
          containerClassName,
        )}
      >
        {label !== undefined && (
          <div className="pr-2 text-sm font-semibold text-muted-foreground">
            {label}
          </div>
        )}

        <div
          className={cn(
            "group flex items-center gap-4",
            label === undefined && "col-start-1 -col-end-1",
            inWidget && "col-start-2 -col-end-1",
          )}
        >
          {graphic?.(value)}

          <div className="w-full">
            {tooltip ? (
              <Tooltip open>
                <TooltipTrigger asChild>
                  <div>{slider}</div>
                </TooltipTrigger>
                <TooltipContent
                  className={cn(
                    "hidden px-3 py-1.5 group-focus-within:block group-hover:block",
                    isActive && "block",
                  )}
                >
                  <p>
                    {typeof tooltip === "function" ? tooltip(value) : tooltip}
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              slider
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SliderInput;
