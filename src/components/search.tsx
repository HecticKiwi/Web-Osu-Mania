"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";

const Search = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");

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

    params.set("q", query);

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
          placeholder="Search..."
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

export default Search;
