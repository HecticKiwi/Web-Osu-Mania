"use client";

import { Settings, useSettingsStore } from "@/stores/settingsStore";
import { ComponentProps } from "react";
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
        <div className="pr-2 text-sm font-semibold text-muted-foreground">
          {label}
        </div>

        <RadioGroup value={value} {...props} />
      </div>
    </>
  );
};

export default RadioGroupInput;
