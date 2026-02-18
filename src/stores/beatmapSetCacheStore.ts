import { idb } from "@/lib/idb";
import { createSelectors } from "@/lib/zustand";
import { enableMapSet } from "immer";
import queryString from "query-string";
import { toast } from "sonner";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BEATMAP_API_PROVIDERS, useSettingsStore } from "./settingsStore";

type BeatmapSetCacheState = {
  beatmapSetCache: Map<number, Blob>;
  idbUsage: number;
  calculateCacheUsage: () => Promise<void>;
  clearIdbCache: () => Promise<void>;
  getBeatmapSet: (
    beatmapSetId: number,
    setDownloadPercent: (percent: number) => void,
  ) => Promise<Blob>;
};

enableMapSet();

const useBeatmapSetCacheStoreBase = create<BeatmapSetCacheState>()(
  immer((set, get) => ({
    beatmapSetCache: new Map(),
    idbUsage: 0,
    calculateCacheUsage: async () => {
      const beatmapCount = await idb.getBeatmapCount();

      if (beatmapCount === 0) {
        set({ idbUsage: 0 });
        return;
      }

      if (!navigator.storage) {
        throw new Error(
          "This device does not support IDB cache usage estimation.",
        );
      }

      const storage = await navigator.storage.estimate();

      if (!storage.usage) {
        throw new Error("Could not determine IDB cache usage.");
      }

      set({ idbUsage: storage.usage });
    },

    clearIdbCache: async () => {
      await idb.clearBeatmapSets();
      await get().calculateCacheUsage();
    },

    getBeatmapSet: async (beatmapSetId, setDownloadPercent) => {
      const {
        storeDownloadedBeatmaps,
        beatmapProvider,
        customBeatmapProvider,
        proxyBeatmapDownloads,
      } = useSettingsStore.getState();

      try {
        let beatmapSetFile = get().beatmapSetCache.get(beatmapSetId);

        if (!beatmapSetFile && storeDownloadedBeatmaps) {
          // Try to get beatmap set from IndexedDB
          const beatmapSet = await idb.getBeatmap(beatmapSetId);
          beatmapSetFile = beatmapSet?.file;
        }

        // If not cached, download it
        if (!beatmapSetFile) {
          let apiUrl: string;
          if (beatmapProvider !== "Custom") {
            apiUrl = BEATMAP_API_PROVIDERS[beatmapProvider].replace(
              "$setId",
              beatmapSetId.toString(),
            );
          } else {
            if (!customBeatmapProvider.includes("$setId")) {
              throw new Error("Custom beatmap provider URL is missing $setId.");
            }

            apiUrl = customBeatmapProvider.replace(
              "$setId",
              beatmapSetId.toString(),
            );
          }

          const destinationUrl = queryString.stringifyUrl({
            url: apiUrl,
          });

          const url = queryString.stringifyUrl({
            url: "/api/downloadBeatmap",
            query: { destinationUrl },
          });

          const response = await fetch(
            proxyBeatmapDownloads ? url : destinationUrl,
            { method: "GET" },
          );

          if (!response.ok || !response.body) {
            const retryAfter = response.headers.get("Retry-After");

            const statusErrorMessages: Record<number, string> = {
              404: "Beatmap does not exist on the current beatmap provider, please switch to another provider in the settings.",
              429: `The beatmap provider is experiencing too many requests, please try again ${retryAfter ? `after ${retryAfter} seconds` : "later"} or switch to another provider in the settings.`,
              500: "The beatmap provider ran into an error, try again later or switch to another provider in the settings.",
              503: "The beatmap provider is currently unavailable, try again later or switch to another provider in the settings.",
              504: "Download request timed out.",
            };

            const errorMessage = statusErrorMessages[response.status];
            throw new Error(
              errorMessage ||
                "An unknown error occurred while trying to download the beatmap, try again later or try switching to another beatmap provider in the settings.",
            );
          }

          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          const contentLength = Number(response.headers.get("Content-Length"));
          let receivedLength = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            setDownloadPercent((receivedLength / contentLength) * 100);
          }

          beatmapSetFile = new Blob(chunks as BlobPart[]);
        }

        // Store or cache beatmap
        if (storeDownloadedBeatmaps) {
          try {
            await idb.putBeatmapSet(beatmapSetId, beatmapSetFile);
            await get().calculateCacheUsage();
          } catch (error) {
            toast("Warning", {
              description:
                "IDB Storage quota exceeded, cache purged. Refresh when you can.",
              duration: 10000,
            });
          }
        } else {
          set((state) => {
            state.beatmapSetCache.set(beatmapSetId, beatmapSetFile);
          });
        }

        return beatmapSetFile;
      } catch (error) {
        if (error instanceof TypeError) {
          throw new Error(
            "An unknown error occurred while trying to download the beatmap, try again later or try switching to another beatmap provider in the settings.",
          );
        }

        throw error;
      }
    },
  })),
);

useBeatmapSetCacheStoreBase.getState().calculateCacheUsage();

export const useBeatmapSetCacheStore = createSelectors(
  useBeatmapSetCacheStoreBase,
);
