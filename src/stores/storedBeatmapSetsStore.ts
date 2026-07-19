import type { BeatmapSet } from "@/lib/osuApi";
import { createIdbStorage, createSelectors } from "@/lib/zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type StoredBeatmapSetsState = {
  storedBeatmapSets: BeatmapSet[];
  setStoredBeatmapSets: (updater: (draft: BeatmapSet[]) => void) => void;
  resetStoredBeatmapSets: () => void;
};

const useStoredBeatmapSetsStoreBase = create<StoredBeatmapSetsState>()(
  persist(
    immer((set) => ({
      storedBeatmapSets: [],

      setStoredBeatmapSets: (updater) => {
        set((state) => {
          updater(state.storedBeatmapSets);
        });
      },

      resetStoredBeatmapSets: () => {
        set((state) => {
          state.storedBeatmapSets = [];
        });
      },
    })),
    {
      name: "storedBeatmapSets",
      storage: createIdbStorage(),
    },
  ),
);

export const useStoredBeatmapSetsStore = createSelectors(
  useStoredBeatmapSetsStoreBase,
);
