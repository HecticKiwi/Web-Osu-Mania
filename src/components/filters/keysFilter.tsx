"use client";

import { parseKeysParam } from "@/lib/searchParams/keysParam";
import { cn, getSettings } from "@/lib/utils";
import { regkeyuimap, regkeyuiclass, extkeyuimap, extkeyuiclass } from "@/osuMania/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Toggle } from "../ui/toggle";

const updateUiClass = () => {
  if (getSettings().show11kp) {
    return extkeyuiclass
  } else {
    return regkeyuiclass
  }
}
const updateUiMap = () => {
  if (getSettings().show11kp) {
    return extkeyuimap
  } else {
    return regkeyuimap
  }
}


const KeysFilter = ({ className }: { className?: string }) => {

  const searchParams = useSearchParams();
  const keysParam = parseKeysParam(searchParams.get("keys"));

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Mode</span>

        <div className={updateUiClass()}>
          {updateUiMap().map((key: string) => {
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
