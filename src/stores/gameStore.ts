import { getBeatmapSetFromOsz } from "@/lib/beatmapParser";
import type { BeatmapSet } from "@/lib/osuApi";
import { getBeatmapSet } from "@/lib/osuApi";
import { createSelectors } from "@/lib/zustand";
import type {
  LocalBeatmapData,
  ReplayData,
} from "@/osuMania/systems/replayRecorder";
import { Howler } from "howler";
import { toast } from "sonner";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type GameState = {
  uploadedBeatmapSet: File | null;
  localReplayBeatmapSet: File | null;
  beatmapSet: BeatmapSet | null;
  beatmapId: number | null;
  replayData: ReplayData | null;
  scrollPosition: number | null;
  startGame: (beatmapId: number) => void;
  startReplay: (replay: ReplayData) => Promise<void>;
  startLocalReplayWithBeatmap: (
    replay: ReplayData,
    file: File,
    allowMismatch?: boolean,
  ) => Promise<"started" | "mismatch" | "error">;
  setBeatmapSet: (beatmapSet: BeatmapSet | null) => void;
  closeGame: () => void;
  setUploadedBeatmapSet: (file: File | null) => void;
  setReplayData: (replay: ReplayData | null) => void;
};

const useGameStoreBase = create<GameState>()(
  immer((set, get) => ({
    uploadedBeatmapSet: null,
    localReplayBeatmapSet: null,
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
      const beatmapSetId =
        "setId" in replay.beatmap ? replay.beatmap.setId : undefined;
      const beatmapId = "id" in replay.beatmap ? replay.beatmap.id : undefined;

      // Prefer online IDs when present
      if (beatmapSetId != null && beatmapId != null) {
        const beatmapSet = await getBeatmapSet(beatmapSetId);

        set((state) => {
          state.localReplayBeatmapSet = null;
          state.beatmapId = Number(beatmapId);
          state.beatmapSet = beatmapSet;
          state.replayData = replay;
        });

        return;
      }

      const beatmapHash = replay.beatmap.hash;
      if (beatmapHash) {
        const uploadedBeatmapSet = get().beatmapSet;

        if (!uploadedBeatmapSet || uploadedBeatmapSet.status !== "local") {
          toast(
            "This replay requires the original local .osz beatmap. Upload the map first, then play the replay.",
          );
          return;
        }

        const localBeatmap = uploadedBeatmapSet.beatmaps.find(
          (beatmap) => beatmap.hash === beatmapHash,
        );

        if (!localBeatmap) {
          toast("Uploaded map does not match replay hash.");
          return;
        }

        set((state) => {
          state.localReplayBeatmapSet = null;
          state.beatmapId = localBeatmap.id;
          state.replayData = replay;
        });

        return;
      }

      toast("Replay is missing beatmap identifiers.");
    },

    startLocalReplayWithBeatmap: async (
      replay: ReplayData,
      file: File,
      allowMismatch = false,
    ) => {
      const beatmapHash = replay.beatmap.hash;
      if (!beatmapHash) {
        toast("Replay is missing local beatmap hash.");
        return "error";
      }

      try {
        const beatmapSet = await getBeatmapSetFromOsz(file);
        const localBeatmap = beatmapSet.beatmaps.find(
          (beatmap) => beatmap.hash === beatmapHash,
        );

        const replayBeatmapData = replay.beatmap as LocalBeatmapData;

        const fallbackBeatmap =
          beatmapSet.beatmaps.find(
            (beatmap) =>
              beatmap.version === replayBeatmapData.version &&
              beatmap.cs === replayBeatmapData.keyCount,
          ) ??
          beatmapSet.beatmaps.find(
            (beatmap) => beatmap.cs === replayBeatmapData.keyCount,
          ) ??
          beatmapSet.beatmaps[0];

        const selectedBeatmap = localBeatmap ?? fallbackBeatmap;

        if (!selectedBeatmap) {
          toast("Uploaded beatmap set has no playable mania difficulties.");
          return "error";
        }

        if (!localBeatmap && !allowMismatch) {
          return "mismatch";
        }

        const currentBeatmapSet = get().beatmapSet;
        if (currentBeatmapSet?.coverUrl) {
          URL.revokeObjectURL(currentBeatmapSet.coverUrl);
        }
        if (currentBeatmapSet?.previewUrl) {
          URL.revokeObjectURL(currentBeatmapSet.previewUrl);
        }

        set((state) => {
          state.uploadedBeatmapSet = null;
          state.localReplayBeatmapSet = file;
          state.beatmapSet = beatmapSet;
          state.beatmapId = selectedBeatmap.id;
          state.replayData = replay;
        });

        return "started";
      } catch (error: any) {
        toast(error.message || "Failed to parse beatmap set from .osz file.");
        return "error";
      }
    },

    closeGame: () => {
      Howler.unload();

      set((state) => {
        state.beatmapId = null;
        state.replayData = null;
        state.localReplayBeatmapSet = null;

        // If playing from an uploaded file, leave beatmapSet so the upload dialog stays open
        if (!state.uploadedBeatmapSet) {
          state.beatmapSet = null;
        }
      });
    },

    setUploadedBeatmapSet: async (file: File | null) => {
      const currentBeatmapSet = get().beatmapSet;
      if (currentBeatmapSet?.coverUrl) {
        URL.revokeObjectURL(currentBeatmapSet.coverUrl);
      }
      if (currentBeatmapSet?.previewUrl) {
        URL.revokeObjectURL(currentBeatmapSet.previewUrl);
      }

      set((state) => {
        state.localReplayBeatmapSet = null;
        state.uploadedBeatmapSet = file;
      });

      if (file) {
        try {
          const beatmapSet = await getBeatmapSetFromOsz(file);

          set((state) => {
            state.beatmapSet = beatmapSet;
          });
        } catch (error: any) {
          set((state) => {
            state.uploadedBeatmapSet = null;
          });

          toast(error.message || "Failed to parse beatmap set from .osz file.");

          return;
        }
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
