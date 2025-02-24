"use client";

import { Idb } from "@/lib/idb";
import queryString from "query-string";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { BEATMAP_API_PROVIDERS, useSettingsContext } from "./settingsProvider";

const BeatmapSetCacheContext = createContext<{
  getBeatmapSet: (
    beatmapSetId: number,
    setDownloadPercent: Dispatch<SetStateAction<number>>,
  ) => Promise<Blob>;
  idbUsage: number;
  clearIdbCache: () => Promise<void>;
}>(null!);

export const useBeatmapSetCacheContext = () => {
  const beatmapSetCache = useContext(BeatmapSetCacheContext);

  if (!beatmapSetCache) {
    throw new Error("Using beatmap set cache context outside of provider");
  }

  return beatmapSetCache;
};

const BeatmapSetCacheProvider = ({ children }: { children: ReactNode }) => {
  const [beatmapSetCache, setBeatmapSetCache] = useState<Map<number, Blob>>(
    new Map(),
  );
  const [idbUsage, setIdbUsage] = useState(0);
  const { settings } = useSettingsContext();

  const calculateCacheUsage = useCallback(async () => {
    const idb = new Idb();
    const beatmapCount = await idb.getBeatmapCount();

    if (beatmapCount === 0) {
      setIdbUsage(0);
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

    setIdbUsage(storage.usage);
  }, []);

  const clearIdbCache = useCallback(async () => {
    const idb = new Idb();
    await idb.clearBeatmapSets();

    await calculateCacheUsage();
  }, [calculateCacheUsage]);

  useEffect(() => {
    calculateCacheUsage();
  }, [calculateCacheUsage]);

  const getBeatmapSet = useCallback(
    async (
      beatmapSetId: number,
      setDownloadPercent: Dispatch<SetStateAction<number>>,
    ) => {
      try {
        const idb = new Idb();

        // Try to get beatmap set from cache
        let beatmapSetFile = beatmapSetCache.get(beatmapSetId);
        if (!beatmapSetFile && settings.storeDownloadedBeatmaps) {
          const beatmapSet = await idb.getBeatmap(beatmapSetId);
          beatmapSetFile = beatmapSet?.file;
        }

        // Otherwise download it
        if (!beatmapSetFile) {
          let apiUrl: string;
          if (settings.beatmapProvider !== "Custom") {
            apiUrl = BEATMAP_API_PROVIDERS[settings.beatmapProvider].replace(
              "$setId",
              beatmapSetId.toString(),
            );
          } else {
            if (!settings.customBeatmapProvider.includes("$setId")) {
              throw new Error("Custom beatmap provider URL is missing $setId.");
            }

            apiUrl = settings.customBeatmapProvider.replace(
              "$setId",
              beatmapSetId.toString(),
            );
          }

          const destinationUrl = queryString.stringifyUrl({
            url: apiUrl,
            query: {
              noVideo: true, // For NeriNyan
            },
          });

          const url = queryString.stringifyUrl({
            url: "/api/downloadBeatmap",
            query: {
              destinationUrl,
            },
          });

          const response = await fetch(
            settings.proxyBeatmapDownloads ? url : destinationUrl,
            {
              method: "GET",
            },
          );

          if (!response.ok || !response.body) {
            if (response.status === 404) {
              throw new Error(
                `Beatmap does not exist on the current beatmap provider, please switch to another provider.`,
              );
            }

            if (response.status === 429) {
              const retryAfter = response.headers.get("Retry-After");

              throw new Error(
                `The beatmap provider is experiencing too many requests, please try again ${retryAfter ? `after ${retryAfter} seconds` : "later"} or switch to another provider.`,
              );
            }

            if (response.status === 500) {
              throw new Error(
                `The beatmap provider ran into an error, try again later or switch to another provider.`,
              );
            }

            if (response.status === 504) {
              throw new Error(`Download request timed out.`);
            }

            throw new Error(
              "An unknown error occurred while trying to download the beatmap, try again later or try switching to another beatmap provider.",
            );
          }

          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];

          const contentLength = +response.headers.get("Content-Length")!;

          let receivedLength = 0;

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            chunks.push(value);
            receivedLength += value.length;

            setDownloadPercent((receivedLength / contentLength) * 100);
          }

          beatmapSetFile = new Blob(chunks);
        }

        // Cache downloaded file
        if (settings.storeDownloadedBeatmaps) {
          try {
            await idb.putBeatmapSet(beatmapSetId, beatmapSetFile);
            calculateCacheUsage();
          } catch (error) {
            // I wish I could delete just enough beatmaps to make room, but
            // 1. The reported usage amount doesn't match the actual amount (security reasons)
            // 2. For some reason the reported amount doesn't update until you refresh
            // Sooo just purge the whole cache and get the user to refresh
            toast("Warning", {
              description:
                "IDB Storage quota exceeded, cache purged. Refresh whenever you get the chance.",
              duration: 10000,
            });
          }
        } else {
          setBeatmapSetCache((prev) => prev.set(beatmapSetId, beatmapSetFile));
        }

        return beatmapSetFile;
      } catch (error) {
        if (error instanceof TypeError) {
          throw new Error(
            `An unknown error occurred while trying to download the beatmap, try again later or try switching to another beatmap provider.`,
          );
        }

        throw error;
      }
    },
    [
      beatmapSetCache,
      calculateCacheUsage,
      settings?.storeDownloadedBeatmaps,
      settings?.beatmapProvider,
      settings?.customBeatmapProvider,
      settings?.proxyBeatmapDownloads,
    ],
  );

  return (
    <>
      <BeatmapSetCacheContext.Provider
        value={{ getBeatmapSet, idbUsage, clearIdbCache }}
      >
        {children}
      </BeatmapSetCacheContext.Provider>
    </>
  );
};

export default BeatmapSetCacheProvider;
