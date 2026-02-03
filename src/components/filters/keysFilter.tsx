import { parseKeysParam } from "@/lib/searchParams/keysParam";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import { Link, useSearch } from "@tanstack/react-router";
import { Toggle } from "../ui/toggle";

export const keys = Array.from({ length: 18 }, (_, i) => (i + 1).toString());

const KeysFilter = ({ className }: { className?: string }) => {
  const search = useSearch({ from: Route.fullPath });
  const keysParam = parseKeysParam(
    typeof search.keys === "string" ? search.keys : undefined,
  );

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Mode</span>

        <div className={"mt-2 flex flex-wrap gap-1.5"}>
          {keys.map((key: string) => {
            let newKeysParam: string[] = [];
            if (keysParam.includes(key)) {
              newKeysParam = keysParam.filter((item) => item !== key);
            } else {
              newKeysParam = [...keysParam, key];
            }

            return (
              <Toggle
                pressed={keysParam.includes(key)}
                value={key}
                key={key}
                variant={"outline"}
                asChild
                className="w-[43px] px-0"
              >
                <Link
                  from={Route.fullPath}
                  search={{
                    ...search,
                    keys:
                      newKeysParam.length > 0
                        ? newKeysParam.join(",")
                        : undefined,
                  }}
                  preloadDelay={0}
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
