"use client";

import { Idb } from "@/lib/idb";
import queryString from "query-string";

import { BeatmapSet } from "@/lib/osuApi";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { settingsContext } from "./settingsProvider";

type CacheItem = {
  blob: Blob;
  url: string;
};

export const BeatmapSetCacheContext = createContext<{
  getBeatmapSet: (beatmapSetId: number) => Promise<Blob>;
  idbUsage: number;
  clearIdbCache: () => Promise<void>;
}>(null!);

const BeatmapSetCacheProvider = ({ children }: { children: ReactNode }) => {
  const [beatmapSetCache, setBeatmapSetCache] = useState<Map<number, Blob>>(
    new Map(),
  );
  const [idbUsage, setIdbUsage] = useState(0);
  const { settings } = useContext(settingsContext);

  const calculateCacheUsage = async () => {
    const idb = new Idb();
    const beatmapCount = await idb.getBeatmapCount();

    if (beatmapCount === 0) {
      setIdbUsage(0);
      return;
    }

    const storage = await navigator.storage.estimate();

    if (!storage.usage) {
      throw new Error("Could not determine cache usage.");
    }

    setIdbUsage(storage.usage);
  };

  const clearIdbCache = async () => {
    const idb = new Idb();
    await idb.clearBeatmapSets();

    await calculateCacheUsage();
  };

  useEffect(() => {
    calculateCacheUsage();
  }, []);

  const getBeatmapSet = async (beatmapSetId: number) => {
    const idb = new Idb();

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
  };

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
