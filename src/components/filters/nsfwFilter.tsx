import { parseNsfwParam } from "@/lib/searchParams/nsfwParam";
import { cn } from "@/lib/utils";
import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "../ui/button";

const NsfwFilter = ({ className }: { className?: string }) => {
  const search = useSearch({ from: "/" });
  const nsfw = parseNsfwParam(
    typeof search.nsfw === "string" ? search.nsfw : undefined,
  );

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Explicit Content</span>

        <div className="flex flex-wrap gap-x-2">
          <Button asChild variant={"link"} className="p-0">
            <Link
              to="/"
              search={{ ...search, nsfw: "false" }}
              preloadDelay={0}
              className={cn("h-8", !nsfw && "text-white")}
            >
              Hide
            </Link>
          </Button>
          <Button asChild variant={"link"} className="p-0">
            <Link
              to="/"
              search={{ ...search, nsfw: undefined }}
              preloadDelay={0}
              className={cn("h-8", nsfw && "text-white")}
            >
              Show
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NsfwFilter;
