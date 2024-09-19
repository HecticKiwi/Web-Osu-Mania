"use client";

import { Idb } from "@/lib/idb";
import queryString from "query-string";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "../ui/use-toast";
import { BEATMAP_API_PROVIDERS, useSettingsContext } from "./settingsProvider";

const BeatmapSetCacheContext = createContext<{
  getBeatmapSet: (beatmapSetId: number) => Promise<Blob>;
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
  const { toast } = useToast();

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
    async (beatmapSetId: number) => {
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

        const url = queryString.stringifyUrl({
          url: apiUrl,
          query: {
            noVideo: true, // For NeriNyan
          },
        });

        const response = await fetch(url, {
          method: "GET",
        });

        if (!response.ok || !response.body) {
          if (response.status === 404) {
            throw new Error(
              `Beatmap does not exist on the current beatmap provider, please switch to another.`,
            );
          }

          if (response.status === 429) {
            throw new Error(
              `The beatmap provider is experiencing too many requests, please try again later or switch to another.`,
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
            "An unknown error occurred while trying to download the beatmap.",
          );
        }

        beatmapSetFile = await response.blob();
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
          toast({
            title: "Warning",
            description:
              "IDB Storage quota exceeded, cache purged. Refresh whenever you get the chance.",
            duration: 10000,
          });
        }
      } else {
        setBeatmapSetCache((prev) => prev.set(beatmapSetId, beatmapSetFile));
      }

      return beatmapSetFile;
    },
    [
      beatmapSetCache,
      calculateCacheUsage,
      settings?.storeDownloadedBeatmaps,
      settings?.beatmapProvider,
      settings?.customBeatmapProvider,
      toast,
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
