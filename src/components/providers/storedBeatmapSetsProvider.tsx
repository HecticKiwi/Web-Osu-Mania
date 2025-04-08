"use client";

import { BeatmapSet } from "@/lib/osuApi";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { Updater, useImmer } from "use-immer";

const StoredBeatmapSetsContext = createContext<{
  storedBeatmapSets: BeatmapSet[];
  setStoredBeatmapSets: Updater<BeatmapSet[]>;
} | null>(null);

export const useStoredBeatmapSetsContext = () => {
  const storedBeatmapSets = useContext(StoredBeatmapSetsContext);

  if (!storedBeatmapSets) {
    throw new Error("Using storedBeatmapSets context outside of provider");
  }

  return storedBeatmapSets;
};

const StoredBeatmapSetsProvider = ({ children }: { children: ReactNode }) => {
  const [storedBeatmapSets, setStoredBeatmapSets] = useImmer<BeatmapSet[]>(
    null!,
  );

  // Load favourites from localstorage
  useEffect(() => {
    const localFavourites = localStorage.getItem("storedBeatmapSets");

    if (localFavourites) {
      setStoredBeatmapSets(JSON.parse(localFavourites));
    } else {
      setStoredBeatmapSets([]);
    }
  }, [setStoredBeatmapSets]);

  // Update localStorage whenever favourites change
  useEffect(() => {
    if (storedBeatmapSets) {
      localStorage.setItem(
        "storedBeatmapSets",
        JSON.stringify(storedBeatmapSets),
      );
    }
  }, [storedBeatmapSets]);

  if (!storedBeatmapSets) {
    return null;
  }

  return (
    <>
      <StoredBeatmapSetsContext.Provider
        value={{
          storedBeatmapSets,
          setStoredBeatmapSets,
        }}
      >
        {children}
      </StoredBeatmapSetsContext.Provider>
    </>
  );
};

export default StoredBeatmapSetsProvider;
