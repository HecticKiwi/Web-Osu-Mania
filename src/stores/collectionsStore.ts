import type { BeatmapSet } from "@/lib/osuApi";
import { createIdbStorage, createSelectors } from "@/lib/zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type CollectionsState = {
  collections: Record<string, BeatmapSet[]>;
  setCollections: (
    updater: (draft: Record<string, BeatmapSet[]>) => void,
  ) => void;
};

const useCollectionsStoreBase = create<CollectionsState>()(
  persist(
    immer((set) => ({
      collections: {},
      setCollections: (fn: (draft: Record<string, BeatmapSet[]>) => void) => {
        set((draft) => {
          fn(draft.collections);
        });
      },
    })),
    {
      name: "collections",
      version: 0,
      storage: createIdbStorage(),
    },
  ),
);

export const useCollectionsStore = createSelectors(useCollectionsStoreBase);
