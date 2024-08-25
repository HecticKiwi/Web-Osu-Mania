"use client";

import { cn } from "@/lib/utils";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { Slider } from "../ui/slider";

export type Stars = {
  min: number;
  max: number;
};

export const DEFAULT_STARS: Stars = {
  min: 0,
  max: 10,
};

export function getStarsParam(searchParams: ReadonlyURLSearchParams) {
  const starsParam = searchParams.get("stars");

  if (starsParam) {
    const [min, max] = starsParam.split("-").map((value) => Number(value));
    return { min, max };
  }

  return DEFAULT_STARS;
}

const DifficultyFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { min, max } = getStarsParam(searchParams);

  const [currentMin, setCurrentMin] = useState(min);
  const [currentMax, setCurrentMax] = useState(max);

  useEffect(() => {
    setCurrentMin(min);
    setCurrentMax(max);
  }, [min, max]);

  const handleValueCommit = ([min, max]: number[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (min !== 0 || max !== 10) {
      params.set("stars", `${min}-${max}`);
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
            min={0}
            max={10}
            step={0.01}
            onValueChange={([min, max]) => {
              setCurrentMin(min);
              setCurrentMax(max);
            }}
            onValueCommit={handleValueCommit}
            className="max-w-full"
          />

          <div className="w-[140px] shrink-0 ">
            {currentMin.toFixed(2)}★ to {currentMax.toFixed(2)}★
          </div>
        </div>
      </div>
    </>
  );
};

export default DifficultyFilter;
