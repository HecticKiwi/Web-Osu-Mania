import {
  DEFAULT_GENRE,
  GENRES,
  parseGenreParam,
} from "@/lib/searchParams/genreParam";
import { cn } from "@/lib/utils";
import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "../ui/button";

const GenreFilter = ({ className }: { className?: string }) => {
  const search = useSearch({ from: "/" });
  const genreParam = parseGenreParam(
    typeof search.genre === "string" ? search.genre : undefined,
  );

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Genre</span>

        <div className="flex flex-wrap gap-x-2">
          {GENRES.map((genre) => {
            return (
              <Button key={genre} asChild variant={"link"} className="p-0">
                <Link
                  to="/"
                  search={{
                    ...search,
                    genre: genre === DEFAULT_GENRE ? undefined : genre,
                  }}
                  preloadDelay={0}
                  className={cn("h-8", genreParam === genre && "text-white")}
                >
                  {genre}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GenreFilter;
