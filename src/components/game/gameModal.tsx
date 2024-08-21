"use client";

import { BeatmapData, parseOsz } from "@/lib/beatmapParser";
import { Idb } from "@/lib/idb";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import {
  GameOverlayContext,
  OpenGameOverlayData,
} from "../providers/gameOverlayProvider";
import GameScreens from "./gameScreens";
import { settingsContext } from "../providers/settingsProvider";
import queryString from "query-string";
import { useToast } from "../ui/use-toast";

const GameModal = () => {
  const { data } = useContext(GameOverlayContext);
  const [mapData, setMapData] = useState<BeatmapData | null>(null);
  const [key, setKey] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { settings, resetSettings, updateSettings } =
    useContext(settingsContext);

  const { toast } = useToast();

  const { beatmapSetId, beatmapId, isOpen } = data as OpenGameOverlayData;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadBeatmap = async () => {
      const idb = new Idb();

      // Get beatmap set from cache if available
      const beatmapSet = await idb.getBeatmap(beatmapSetId);
      let beatmapSetFile = beatmapSet?.file;

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

        const fetchBeatmapSet = async () =>
          fetch(url, {
            method: "GET",
          });

        let response = await fetchBeatmapSet();

        while (response.status === 429) {
          const retryAfter = Number(response.headers.get("Retry-After"));

          setLoadingMessage(
            `Too many network requests in a short time. Trying again in ${retryAfter}s`,
          );

          await new Promise((resolve) =>
            setTimeout(resolve, retryAfter * 1000),
          );

          response = await fetchBeatmapSet();
        }

        if (!response.ok || !response.body) {
          throw new Error(response.statusText);
        }

        beatmapSetFile = await response.blob();
      }

      // Cache downloaded file with date accessed
      try {
        await idb.putBeatmapSet(beatmapSetId, beatmapSetFile);
      } catch (error: any) {
        if (error.code === DOMException.QUOTA_EXCEEDED_ERR) {
          toast({
            title: "Warning",
            description:
              "Storage quota exceeded, cache purged. Refresh whenever you get the chance.",
            duration: 10000,
          });
        }
      }

      const mapData = await parseOsz(beatmapSetFile, beatmapId);

      setMapData(mapData);
    };

    loadBeatmap();
  }, [isOpen, beatmapSetId, beatmapId, toast]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (mapData) {
        URL.revokeObjectURL(mapData.backgroundUrl);
        URL.revokeObjectURL(mapData.audio.url);
      }
    };
  }, [mapData]);

  const retry = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <main className="relative grid">
      {!mapData && (
        <div className="place-self-center text-center">
          <h1 className="text-5xl font-bold text-white">Loading Beatmap...</h1>
          {loadingMessage && (
            <p className="mt-8 text-xl text-muted-foreground">
              {loadingMessage}
            </p>
          )}
        </div>
      )}
      {mapData && (
        <>
          <Image
            src={mapData.backgroundUrl}
            alt="Beatmap Background"
            fill
            className="-z-[1] object-cover"
            style={{
              filter: `brightness(${1 - settings.backgroundDim})`,
            }}
          />

          <GameScreens key={key} mapData={mapData} retry={retry} />
        </>
      )}
    </main>
  );
};

export default GameModal;
