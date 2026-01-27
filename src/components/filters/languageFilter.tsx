import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  parseLanguageParam,
} from "@/lib/searchParams/languageParam";
import { cn } from "@/lib/utils";
import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "../ui/button";

const LanguageFilter = ({ className }: { className?: string }) => {
  const search = useSearch({ from: "/" });
  const languageParam = parseLanguageParam(
    typeof search.language === "string" ? search.language : undefined,
  );

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Language</span>

        <div className="flex flex-wrap gap-x-2">
          {LANGUAGES.map((language) => {
            return (
              <Button key={language} asChild variant={"link"} className="p-0">
                <Link
                  to="/"
                  search={{
                    ...search,
                    language:
                      language === DEFAULT_LANGUAGE ? undefined : language,
                  }}
                  preloadDelay={0}
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
