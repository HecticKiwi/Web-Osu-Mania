"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { Toggle } from "../ui/toggle";
import { DEFAULT_MODE } from "../beatmapSetsInfiniteScroll";

const KeysBar = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const modeParam = searchParams.get("key")?.split(",") || DEFAULT_MODE;

  const toggleKey = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let newModeParam: string[] = [];
    if (modeParam.includes(key)) {
      newModeParam = modeParam.filter((item) => item !== key);
    } else {
      newModeParam = [...modeParam, key];
    }

    if (newModeParam.length) {
      params.set("key", newModeParam.join(","));
    } else {
      params.delete("key");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <div>
        <span className="text-muted-foreground">Mode</span>

        <div className="mt-2 flex gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((mode) => {
            return (
              <Toggle
                pressed={modeParam.includes(mode)}
                value={mode}
                key={mode}
                variant={"outline"}
                onClick={() => toggleKey(mode)}
              >
                {mode}K
              </Toggle>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default KeysBar;
