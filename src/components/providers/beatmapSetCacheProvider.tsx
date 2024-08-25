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
import { useSettingsContext } from "./settingsProvider";

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

  const calculateCacheUsage = useCallback(async () => {
    const idb = new Idb();
    const beatmapCount = await idb.getBeatmapCount();

    if (beatmapCount === 0) {
      setIdbUsage(0);
      return;
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
        // https://nerinyan.stoplight.io/docs/nerinyan-api/df11b327494c9-download-beatmapset
        const url = queryString.stringifyUrl({
          url: `https://api.nerinyan.moe/d/${beatmapSetId}`,
          query: {
            // NoStoryboard: true,
            noVideo: true,
          },
        });

        const response = await fetch(url, {
          method: "GET",
        });

        if (!response.ok || !response.body) {
          throw new Error(response.statusText);
        }

        beatmapSetFile = await response.blob();
      }

      // Cache downloaded file with date accessed
      if (settings.storeDownloadedBeatmaps) {
        await idb.putBeatmapSet(beatmapSetId, beatmapSetFile);
        calculateCacheUsage();
      } else {
        setBeatmapSetCache((prev) => prev.set(beatmapSetId, beatmapSetFile));
      }

      return beatmapSetFile;
    },
    [beatmapSetCache, calculateCacheUsage, settings?.storeDownloadedBeatmaps],
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
