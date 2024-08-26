"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import {
  parseLanguageParam,
  LANGUAGES,
  DEFAULT_LANGUAGE,
} from "@/lib/searchParams/languageParam";

const LanguageFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const languageParam = parseLanguageParam(searchParams.get("language"));

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
