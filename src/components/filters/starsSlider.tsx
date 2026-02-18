import { useState } from "react";
import { Slider } from "../ui/slider";
import { maxDisplayValue, minDisplayValue } from "./starsFilter";

const StarsSlider = ({
  initialMin,
  initialMax,
  onCommit,
}: {
  initialMin: number;
  initialMax: number;
  onCommit: (values: number[]) => void;
}) => {
  const [currentMin, setCurrentMin] = useState(initialMin);
  const [currentMax, setCurrentMax] = useState(initialMax);

  return (
    <div className="mt-2 flex items-center gap-4">
      <Slider
        value={[currentMin, currentMax]}
        min={minDisplayValue}
        max={maxDisplayValue}
        step={0.01}
        onValueChange={([min, max]) => {
          setCurrentMin(min);
          setCurrentMax(max);
        }}
        onValueCommit={onCommit}
        className="max-w-full"
      />
      <div className="w-35 shrink-0">
        {currentMin.toFixed(2)}★ to{" "}
        {currentMax === maxDisplayValue ? "∞" : currentMax.toFixed(2)}★
      </div>
    </div>
  );
};

export default StarsSlider;
