import { BeatmapSet } from "@/lib/osuApi";
import { createSelectors, getLocalStorageConfig } from "@/lib/zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type StoredBeatmapSetsState = {
  storedBeatmapSets: BeatmapSet[];
  setStoredBeatmapSets: (updater: (draft: BeatmapSet[]) => void) => void;
};

function migrateCallback(data: BeatmapSet[]): Partial<StoredBeatmapSetsState> {
  return {
    storedBeatmapSets: data,
  };
}

const useStoredBeatmapSetsStoreBase = create<StoredBeatmapSetsState>()(
  persist(
    immer((set) => ({
      storedBeatmapSets: [],

      setStoredBeatmapSets: (updater) => {
        set((state) => {
          updater(state.storedBeatmapSets);
        });
      },
    })),
    {
      name: "storedBeatmapSets",
      storage: getLocalStorageConfig({ migrateCallback }),
    },
  ),
);

export const useStoredBeatmapSetsStore = createSelectors(
  useStoredBeatmapSetsStoreBase,
);
