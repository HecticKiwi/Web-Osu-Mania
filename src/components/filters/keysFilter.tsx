"use client";

import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Toggle } from "../ui/toggle";
import { cn } from "@/lib/utils";

export const DEFAULT_MODE = [];

export function getKeysParam(searchParams: ReadonlyURLSearchParams) {
  return searchParams.get("key")?.split(",") || DEFAULT_MODE;
}

const KeysFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const modeParam = getKeysParam(searchParams);

  const toggleKey = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let newModeParam: string[] = [];
    if (modeParam.includes(key)) {
      newModeParam = modeParam.filter((item) => item !== key);
    } else {
      newModeParam = [...modeParam, key];
    }

    if (newModeParam.length > 0) {
      params.set("key", newModeParam.join(","));
    } else {
      params.delete("key");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <div className={cn(className)}>
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

export default KeysFilter;
