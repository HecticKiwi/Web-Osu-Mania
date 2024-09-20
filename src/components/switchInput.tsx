import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ComponentProps } from "react";
import { Switch } from "./ui/switch";

const SwitchInput = ({
  label,
  tooltip,
  ...props
}: { label: string; tooltip?: string } & ComponentProps<typeof Switch>) => {
  return (
    <>
      <div className="grid grid-cols-2 items-center">
        <div className="pr-2 text-sm font-semibold text-muted-foreground">
          {label}
        </div>

        {tooltip ? (
          <div className="group flex">
            <Tooltip open>
              <TooltipTrigger asChild>
                <div>
                  <Switch className="block" {...props} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <Switch {...props} />
        )}
      </div>
    </>
  );
};

export default SwitchInput;
