"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Slider } from "../ui/slider";
import { DEFAULT_STARS } from "../beatmapSetsInfiniteScroll";
import { cn } from "@/lib/utils";

const DifficultySlider = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const stars = searchParams.get("stars") || DEFAULT_STARS;
  const [min, max] = stars.split("-").map((value) => Number(value));

  const [currentMin, setCurrentMin] = useState(min);
  const [currentMax, setCurrentMax] = useState(max);

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
            defaultValue={[min, max]}
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

export default DifficultySlider;
