import { getBeatmapSetIdFromOsz } from "@/lib/beatmapParser";
import { BeatmapSet, getBeatmapSet } from "@/lib/osuApi";
import { BASE_PATH } from "@/lib/utils";
import { createSelectors } from "@/lib/zustand";
import { ReplayData } from "@/osuMania/systems/replayRecorder";
import { Howler } from "howler";
import queryString from "query-string";
import { toast } from "sonner";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type GameState = {
  uploadedBeatmapSet: File | null;
  beatmapSet: BeatmapSet | null;
  beatmapId: number | null;
  replayData: ReplayData | null;
  scrollPosition: number | null;
  startGame: (beatmapId: number) => void;
  startReplay: (replay: ReplayData) => Promise<void>;
  setBeatmapSet: (beatmapSet: BeatmapSet | null) => void;
  closeGame: () => void;
  setUploadedBeatmapSet: (file: File | null) => void;
  setReplayData: (replay: ReplayData | null) => void;
};

const useGameStoreBase = create<GameState>()(
  immer((set, get) => ({
    uploadedBeatmapSet: null,
    beatmapSet: null,
    beatmapId: null,
    replayData: null,
    scrollPosition: null,

    startGame: (beatmapId: number) => {
      set((state) => {
        state.beatmapId = beatmapId;

        // Site content is hidden while playing game, so scroll position must be restored afterwards
        state.scrollPosition = window.scrollY;
      });
    },

    startReplay: async (replay: ReplayData) => {
      const beatmapSetId = replay.beatmap.setId;
      const beatmapId = Number(replay.beatmap.id);

      const beatmapSet = await getBeatmapSet(beatmapSetId);

      set((state) => {
        state.beatmapId = beatmapId;
        state.beatmapSet = beatmapSet;
        state.replayData = replay;
      });
    },

    closeGame: () => {
      Howler.unload();

      set((state) => {
        state.beatmapId = null;
        state.replayData = null;

        // If playing from an uploaded file, leave beatmapSet so the upload dialog stays open
        if (!state.uploadedBeatmapSet) {
          state.beatmapSet = null;
        }
      });
    },

    setUploadedBeatmapSet: async (file: File | null) => {
      set((state) => {
        state.uploadedBeatmapSet = file;
      });

      if (file) {
        const beatmapSetId = await getBeatmapSetIdFromOsz(file);

        // Fetch beatmap set data from osu (cover BG, preview audio, diff star ratings, etc.)
        // Theoretically I could do this manually but that's too much work :<
        const url = queryString.stringifyUrl({
          url: `${BASE_PATH}/api/getBeatmap`,
          query: { beatmapSetId },
        });

        const beatmapSetRes = await fetch(url);

        if (!beatmapSetRes.ok) {
          set((state) => {
            state.uploadedBeatmapSet = null;
          });

          const message = await beatmapSetRes.text();
          toast(message);

          return;
        }

        const beatmapSet: BeatmapSet = await beatmapSetRes.json();

        set((state) => {
          state.beatmapSet = beatmapSet;
        });
      } else {
        set((state) => {
          state.beatmapSet = null;
        });
      }
    },

    setReplayData: (replay: ReplayData | null) => {
      set((state) => {
        state.replayData = replay;
      });
    },

    setBeatmapSet: (beatmapSet: BeatmapSet | null) => {
      set((state) => {
        state.beatmapSet = beatmapSet;
      });
    },
  })),
);

export const useGameStore = createSelectors(useGameStoreBase);
