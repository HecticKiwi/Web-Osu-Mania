"use client";

import { BeatmapSet } from "@/lib/osuApi";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { Updater, useImmer } from "use-immer";

const FavouritesContext = createContext<{
  savedBeatmapSets: BeatmapSet[];
  setSavedBeatmapSets: Updater<BeatmapSet[]>;
} | null>(null);

export const useSavedBeatmapSetsContext = () => {
  const savedBeatmapSets = useContext(FavouritesContext);

  if (!savedBeatmapSets) {
    throw new Error("Using favourites context outside of provider");
  }

  return savedBeatmapSets;
};

const SavedBeatmapSetsProvider = ({ children }: { children: ReactNode }) => {
  const [savedBeatmapSets, setSavedBeatmapSets] = useImmer<BeatmapSet[]>(null!);

  // Load favourites from localstorage
  useEffect(() => {
    const localFavourites = localStorage.getItem("savedBeatmapSets");

    if (localFavourites) {
      setSavedBeatmapSets(JSON.parse(localFavourites));
    } else {
      setSavedBeatmapSets([]);
    }
  }, [setSavedBeatmapSets]);

  // Update localStorage whenever favourites change
  useEffect(() => {
    if (savedBeatmapSets) {
      localStorage.setItem(
        "savedBeatmapSets",
        JSON.stringify(savedBeatmapSets),
      );
    }
  }, [savedBeatmapSets]);

  if (!savedBeatmapSets) {
    return null;
  }

  return (
    <>
      <FavouritesContext.Provider
        value={{
          savedBeatmapSets,
          setSavedBeatmapSets,
        }}
      >
        {children}
      </FavouritesContext.Provider>
    </>
  );
};

export default SavedBeatmapSetsProvider;
