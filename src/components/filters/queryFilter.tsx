import { parseQueryParam } from "@/lib/searchParams/queryParam";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import { useNavigate } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const SearchFilter = ({ className }: { className?: string }) => {
  const { q } = Route.useSearch();
  // const searchParams = useSearchParams();
  const queryParam = parseQueryParam(q);
  const navigate = useNavigate({ from: Route.fullPath });

  // const router = useRouter();
  const [query, setQuery] = useState(queryParam);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const search = (e?: FormEvent) => {
    e?.preventDefault();

    navigate({
      search: (prev) => {
        const newSearch = { ...prev };

        // If adding query, change sort by to descending relevance
        if (query && !prev.q) {
          newSearch.sortCriteria = "relevance";
          newSearch.sortDirection = "desc";
        }

        // If removing query, change sort by to descending ranked date
        if (prev.q && !query) {
          newSearch.sortCriteria = "ranked";
          newSearch.sortDirection = "desc";
        }

        if (query) {
          newSearch.q = query;
        } else {
          newSearch.q = undefined;
        }

        return newSearch;
      },
    });
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
