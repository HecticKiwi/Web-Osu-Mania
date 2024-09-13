import { ComponentProps } from "react";
import { Switch } from "./ui/switch";

const SwitchInput = ({
  label,
  ...props
}: { label: string } & ComponentProps<typeof Switch>) => {
  return (
    <>
      <div className="grid grid-cols-2 items-center">
        <div className="pr-2 text-sm font-semibold text-muted-foreground">
          {label}
        </div>
        <Switch {...props} />
      </div>
    </>
  );
};

export default SwitchInput;
