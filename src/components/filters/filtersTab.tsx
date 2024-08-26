import NsfwFilter from "./nsfwFilter";
import GenreFilter from "./genreFilter";
import { Button } from "../ui/button";
import Link from "next/link";
import LanguageFilter from "./languageFilter";
import CategoryFilter from "./categoryFilter";
import SortFilter from "./sortFilter";
import KeysFilter from "./keysFilter";
import DifficultyFilter from "./starsFilter";
import SearchFilter from "./queryFilter";

const FiltersTab = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchFilter />
        <KeysFilter />
        <DifficultyFilter />
        <CategoryFilter />
        <NsfwFilter />
        <GenreFilter />
        <LanguageFilter />
        <SortFilter />

        <Button variant={"destructive"} className="mt-4 w-full" asChild>
          <Link href={"/"}>Reset Filters</Link>
        </Button>
      </div>
    </>
  );
};

export default FiltersTab;
