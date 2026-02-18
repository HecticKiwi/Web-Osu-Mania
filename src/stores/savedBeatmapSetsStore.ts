import type { BeatmapSet } from "@/lib/osuApi";
import { createSelectors, getLocalStorageConfig } from "@/lib/zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SavedBeatmapSetsState = {
  savedBeatmapSets: BeatmapSet[];
  setSavedBeatmapSets: (updater: (draft: BeatmapSet[]) => void) => void;
};

function migrateCallback(data: BeatmapSet[]): Partial<SavedBeatmapSetsState> {
  return {
    savedBeatmapSets: data,
  };
}

const useSavedBeatmapSetsStoreBase = create<SavedBeatmapSetsState>()(
  persist(
    immer((set) => ({
      savedBeatmapSets: [],

      setSavedBeatmapSets: (updater) => {
        set((state) => {
          updater(state.savedBeatmapSets);
        });
      },
    })),
    {
      name: "savedBeatmapSets",
      storage: getLocalStorageConfig({ migrateCallback }),
    },
  ),
);

export const useSavedBeatmapSetsStore = createSelectors(
  useSavedBeatmapSetsStoreBase,
);
