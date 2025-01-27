"use client";

import { parseCategoryParam } from "@/lib/searchParams/categoryParam";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import CategoryFilter from "./categoryFilter";
import GenreFilter from "./genreFilter";
import KeysFilter from "./keysFilter";
import LanguageFilter from "./languageFilter";
import NsfwFilter from "./nsfwFilter";
import SearchFilter from "./queryFilter";
import SortFilter from "./sortFilter";
import DifficultyFilter from "./starsFilter";

const FiltersTab = () => {
  const searchParams = useSearchParams();
  const category = parseCategoryParam(searchParams.get("category"));
  const viewingSavedBeatmapSets = category === "Saved";

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchFilter />
        <KeysFilter />
        <DifficultyFilter />
        <CategoryFilter />
        <NsfwFilter />
        {!viewingSavedBeatmapSets && (
          <>
            <GenreFilter />
            <LanguageFilter />
          </>
        )}
        <SortFilter />

        <Button variant={"destructive"} className="mt-4 w-full" asChild>
          <Link href={"/"} prefetch={false}>
            Reset Filters
          </Link>
        </Button>
      </div>
    </>
  );
};

export default FiltersTab;
