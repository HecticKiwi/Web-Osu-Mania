import {
  CUSTOM_CATEGORIES,
  parseCategoryParam,
} from "@/lib/searchParams/categoryParam";
import { Route } from "@/routes";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CategoryFilter from "./categoryFilter";
import CollectionFilter from "./collectionFilter";
import GenreFilter from "./genreFilter";
import KeysFilter from "./keysFilter";
import LanguageFilter from "./languageFilter";
import NsfwFilter from "./nsfwFilter";
import SearchFilter from "./queryFilter";
import SortFilter from "./sortFilter";
import DifficultyFilter from "./starsFilter";

const FiltersTab = () => {
  const search = Route.useSearch();

  const category = parseCategoryParam(search.category);
  const viewingCustom =
    CUSTOM_CATEGORIES.includes(category) || search.collection;

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchFilter />
        <KeysFilter />
        <DifficultyFilter />
        {!search.collection && <CategoryFilter />}
        <CollectionFilter />
        <NsfwFilter />
        {!viewingCustom && (
          <>
            <GenreFilter />
            <LanguageFilter />
          </>
        )}
        <SortFilter />

        <Button variant={"destructive"} className="mt-4 w-full" asChild>
          <Link
            to={"/"}
            onClick={() => {
              toast("Filters have been reset.");
            }}
          >
            Reset Filters
          </Link>
        </Button>
      </div>
    </>
  );
};

export default FiltersTab;
