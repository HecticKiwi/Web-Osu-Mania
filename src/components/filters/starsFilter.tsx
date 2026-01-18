"use client";

import { parseStarsParam } from "@/lib/searchParams/starsParam";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Slider } from "../ui/slider";

const minDisplayValue = 0;
const maxDisplayValue = 10;

const DifficultyFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { min, max } = parseStarsParam(searchParams.get("stars"));

  const [currentMin, setCurrentMin] = useState(min ?? minDisplayValue);
  const [currentMax, setCurrentMax] = useState(max ?? maxDisplayValue);

  useEffect(() => {
    setCurrentMin(min ?? minDisplayValue);
    setCurrentMax(max ?? maxDisplayValue);
  }, [min, max]);

  const handleValueCommit = ([min, max]: number[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (min !== minDisplayValue || max !== maxDisplayValue) {
      params.set(
        "stars",
        `${min === minDisplayValue ? "null" : min}-${max === maxDisplayValue ? "null" : max}`,
      );
    } else {
      params.delete("stars");
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Difficulty</span>

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
            onValueCommit={handleValueCommit}
            className="max-w-full"
          />

          <div className="w-[140px] shrink-0 ">
            {currentMin.toFixed(2)}★ to{" "}
            {currentMax === maxDisplayValue ? "∞" : currentMax.toFixed(2)}★
          </div>
        </div>
      </div>
    </>
  );
};

export default DifficultyFilter;
