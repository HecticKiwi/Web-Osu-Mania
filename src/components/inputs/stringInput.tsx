import type { Settings } from "@/stores/settingsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { ComponentProps, ReactNode } from "react";
import { Input } from "../ui/input";

const StringInput = ({
  label,
  selector,
  description,
  ...props
}: {
  label: string;
  selector: (settings: Settings) => string;
  description?: ReactNode;
} & ComponentProps<typeof Input>) => {
  const value = useSettingsStore(selector);

  return (
    <>
      <div className="grid grid-cols-2 items-center">
        <div className="text-muted-foreground pr-2 text-sm font-semibold">
          {label}
        </div>

        <Input value={value} {...props} />
      </div>
      {description && (
        <p className="text-muted-foreground/75 mt-1 text-sm">{description}</p>
      )}
    </>
  );
};

export default StringInput;
