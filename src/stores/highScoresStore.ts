import { createSelectors, getLocalStorageConfig } from "@/lib/zustand";
import { Results } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type HighScore = {
  timestamp: number;
  mods: string[];
  results: Results;
  replayId: string;
};

export type BeatmapSetHighScores = Record<number, HighScore>;

type HighScoresState = {
  highScores: Record<number, BeatmapSetHighScores>;
  setHighScores: (
    updater: (draft: Record<number, BeatmapSetHighScores>) => void,
  ) => void;
  resetHighScores: () => void;
};

function migrateCallback(
  data: Record<number, BeatmapSetHighScores>,
): Partial<HighScoresState> {
  return {
    highScores: data,
  };
}

const useHighScoresStoreBase = create<HighScoresState>()(
  persist(
    immer((set) => ({
      highScores: {},

      setHighScores: (updater) => {
        set((state) => {
          updater(state.highScores);
        });
      },

      resetHighScores: () => {
        set((state) => {
          state.highScores = {};
        });
      },
    })),
    {
      name: "highScores",
      storage: getLocalStorageConfig({ migrateCallback }),
    },
  ),
);

export const useHighScoresStore = createSelectors(useHighScoresStoreBase);
