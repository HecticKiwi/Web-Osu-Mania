import { createSelectors, getLocalStorageConfig } from "@/lib/zustand";
import { Results } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const MAX_SCORES_PER_BEATMAP = 5;

export type HighScore = {
  timestamp: number;
  mods: string[];
  results: Results;
  replayId: string;
};

export type BeatmapSetHighScores = Record<number, HighScore[]>;

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
      version: 1,
      migrate(persistedState: any, version) {
        if (version === 0) {
          // V1 stores beatmap scores in arrays to allow multiple scores per beatmap
          Object.values(persistedState.highScores).forEach(
            (beatmapSet: any) => {
              Object.keys(beatmapSet).forEach((beatmapSetId) => {
                beatmapSet[beatmapSetId] = [beatmapSet[beatmapSetId]];
              });
            },
          );
        }

        return persistedState;
      },
    },
  ),
);

export const useHighScoresStore = createSelectors(useHighScoresStoreBase);
