import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { cn, roundToPrecision } from "@/lib/utils";

const IntegerInput = ({
  label,
  value,
  setValue,
  min,
  max,
  step = 1,
  className,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) => {
  const increment = () => {
    if (max !== undefined && value < max) {
      setValue(roundToPrecision(value + step, 2));
    }
  };

  const decrement = () => {
    if (min !== undefined && value > min) {
      setValue(roundToPrecision(value - step, 2));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      if (min && newValue < min) {
        newValue = min;
      } else if (max && newValue > max) {
        newValue = max;
      }
      setValue(roundToPrecision(newValue, 2));
    }
  };

  return (
    <>
      <div className={cn("grid grid-cols-2 items-center", className)}>
        <div className="text-sm font-semibold text-muted-foreground">
          {label}
        </div>

        <div className="flex gap-4">
          <Button size={"icon"} onClick={decrement} className="w- shrink-0">
            <Minus />
          </Button>
          <Input
            type="number"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <Button size={"icon"} onClick={increment} className="shrink-0">
            <Plus />
          </Button>
        </div>
      </div>
    </>
  );
};

export default IntegerInput;
