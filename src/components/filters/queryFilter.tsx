"use client";

import { parseQueryParam } from "@/lib/searchParams/queryParam";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const SearchFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const queryParam = parseQueryParam(searchParams.get("q"));

  const router = useRouter();
  const [query, setQuery] = useState(queryParam);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const search = (e?: FormEvent) => {
    e?.preventDefault();

    const params = new URLSearchParams(searchParams);

    const oldQuery = params.get("q");

    // If adding query, change sort by to descending relevance
    if (query && !oldQuery) {
      params.set("sortCriteria", "relevance");
      params.set("sortDirection", "desc");
    }

    // If removing query, change sort by to descending ranked date
    if (oldQuery && !query) {
      params.set("sortCriteria", "ranked");
      params.set("sortDirection", "desc");
    }

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={search} className={cn(className)}>
      <Label htmlFor="search" className="text-base text-muted-foreground">
        Search
      </Label>
      <div className="mt-2 flex items-center gap-4">
        <Input
          id="search"
          className="rounded-xl"
          type="text"
          placeholder="Type in keywords..."
          value={query}
          onChange={({ target }) => setQuery(target.value)}
        />
        <Button
          type="button"
          size={"icon"}
          className="shrink-0"
          onClick={() => search()}
        >
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default SearchFilter;
