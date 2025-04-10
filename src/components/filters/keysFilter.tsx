"use client";

import { parseKeysParam } from "@/lib/searchParams/keysParam";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSettingsContext } from "../providers/settingsProvider";
import { Toggle } from "../ui/toggle";

const rankedKeys = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
const allKeys = Array.from({ length: 18 }, (_, i) => (i + 1).toString());

const KeysFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const { settings } = useSettingsContext();
  const keysParam = parseKeysParam(searchParams.get("keys"));

  const keys = settings.showUnrankedModes ? allKeys : rankedKeys;

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Mode</span>

        <div className={"mt-2 flex flex-wrap gap-1.5"}>
          {keys.map((key: string) => {
            const params = new URLSearchParams(searchParams.toString());

            let newKeysParam: string[] = [];
            if (keysParam.includes(key)) {
              newKeysParam = keysParam.filter((item) => item !== key);
            } else {
              newKeysParam = [...keysParam, key];
            }

            if (newKeysParam.length > 0) {
              params.set("keys", newKeysParam.join(","));
            } else {
              params.delete("keys");
            }

            return (
              <Toggle
                pressed={keysParam.includes(key)}
                value={key}
                key={key}
                variant={"outline"}
                asChild
              >
                <Link
                  href={`/?${params.toString()}`}
                  prefetch={false}
                  className="w-[43px] px-0"
                >
                  {key}K
                </Link>
              </Toggle>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default KeysFilter;
