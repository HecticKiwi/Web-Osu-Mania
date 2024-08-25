"use client";

import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Toggle } from "../ui/toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const DEFAULT_KEYS = [];

export function getKeysParam(searchParams: ReadonlyURLSearchParams) {
  return searchParams.get("key")?.split(",") || DEFAULT_KEYS;
}

const KeysFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();

  const keysParam = getKeysParam(searchParams);

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Mode</span>

        <div className="mt-2 flex gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => {
            const params = new URLSearchParams(searchParams.toString());

            let newKeysParam: string[] = [];
            if (keysParam.includes(key)) {
              newKeysParam = keysParam.filter((item) => item !== key);
            } else {
              newKeysParam = [...keysParam, key];
            }

            if (newKeysParam.length > 0) {
              params.set("key", newKeysParam.join(","));
            } else {
              params.delete("key");
            }

            return (
              <Toggle
                pressed={keysParam.includes(key)}
                value={key}
                key={key}
                variant={"outline"}
                asChild
              >
                <Link href={`/?${params.toString()}`}>{key}K</Link>
              </Toggle>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default KeysFilter;
