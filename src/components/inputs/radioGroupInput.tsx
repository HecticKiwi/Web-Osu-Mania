import type { Settings } from "@/stores/settingsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { ComponentProps } from "react";
import { RadioGroup } from "../ui/radio-group";

const RadioGroupInput = ({
  label,
  selector,
  ...props
}: {
  label: string;
  selector: (settings: Settings) => string;
} & ComponentProps<typeof RadioGroup>) => {
  const value = useSettingsStore(selector);

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="text-muted-foreground pr-2 text-sm font-semibold">
          {label}
        </div>

        <RadioGroup value={value} {...props} />
      </div>
    </>
  );
};

export default RadioGroupInput;
