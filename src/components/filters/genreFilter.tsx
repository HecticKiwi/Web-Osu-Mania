"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { DEFAULT_MODE } from "./keysFilter";

export const GENRES = [
  "Any",
  "Unspecified",
  "Video Game",
  "Anime",
  "Rock",
  "Pop",
  "Other",
  "Novelty",
  "Hip Hop",
  "Electronic",
  "Metal",
  "Classical",
  "Folk",
  "Jazz",
] as const;
export type Genre = (typeof GENRES)[number];
export const DEFAULT_GENRE: Genre = "Any";

export function getGenreParam(searchParams: ReadonlyURLSearchParams) {
  return (searchParams.get("genre") as Genre) ?? DEFAULT_GENRE;
}

const GenreFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const genreParam = getGenreParam(searchParams);

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Genre</span>

        <div className="flex flex-wrap gap-x-2">
          {GENRES.map((genre) => {
            const params = new URLSearchParams(searchParams);

            if (genre === DEFAULT_GENRE) {
              params.delete("genre");
            } else {
              params.set("genre", genre);
            }

            return (
              <Button key={genre} asChild variant={"link"} className="p-0">
                <Link
                  href={`/?${params.toString()}`}
                  scroll={false}
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
