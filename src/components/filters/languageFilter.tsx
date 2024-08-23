"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Genre, DEFAULT_GENRE } from "./genreFilter";

export const LANGUAGES = [
  "Any",
  "English",
  "Chinese",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Korean",
  "Spanish",
  "Swedish",
  "Russian",
  "Polish",
  "Instrumental",
  "Unspecified",
  "Other",
] as const;
export type Language = (typeof LANGUAGES)[number];

// Idk what's up with these random indexes, I just copied the osu site's numbers
export const LANGUAGE_INDEXES = new Map<Language, number>([
  ["Any", 0],
  ["English", 2],
  ["Chinese", 4],
  ["French", 7],
  ["German", 8],
  ["Italian", 11],
  ["Japanese", 3],
  ["Korean", 6],
  ["Spanish", 10],
  ["Swedish", 9],
  ["Russian", 12],
  ["Polish", 13],
  ["Instrumental", 5],
  ["Unspecified", 1],
  ["Other", 14],
]);

export const DEFAULT_LANGUAGE: Language = "Any";

export function getLanguageParam(searchParams: ReadonlyURLSearchParams) {
  return (searchParams.get("language") as Language) ?? DEFAULT_LANGUAGE;
}

const LanguageFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const languageParam = getLanguageParam(searchParams);

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Language</span>

        <div className="flex flex-wrap gap-x-2">
          {LANGUAGES.map((language) => {
            const params = new URLSearchParams(searchParams);

            if (language === DEFAULT_LANGUAGE) {
              params.delete("language");
            } else {
              params.set("language", language);
            }

            return (
              <Button key={language} asChild variant={"link"} className="p-0">
                <Link
                  href={`/?${params.toString()}`}
                  scroll={false}
                  className={cn(
                    "h-8",
                    languageParam === language && "text-white",
                  )}
                >
                  {language}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LanguageFilter;
