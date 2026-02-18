import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Settings } from "@/stores/settingsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { ComponentProps } from "react";

export const NULL_OPTION = "__null__";

const SelectInput = ({
  label,
  selector,
  placeholder,
  className,
  children,
  ...props
}: {
  label: string;
  selector: (settings: Settings) => string;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
} & ComponentProps<typeof Select>) => {
  const value = useSettingsStore(selector);

  return (
    <div className={cn("grid grid-cols-2 items-center", className)}>
      <div className="text-muted-foreground pr-2 text-sm font-semibold">
        {label}
      </div>

      <Select value={value ?? NULL_OPTION} {...props}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
};

export default SelectInput;
