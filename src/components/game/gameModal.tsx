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
import { BeatmapSetCacheContext } from "../providers/beatmapSetCacheProvider";

const GameModal = () => {
  const { data } = useContext(GameOverlayContext);
  const [mapData, setMapData] = useState<BeatmapData | null>(null);
  const [key, setKey] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Downloading Beatmap...",
  );
  const { settings, resetSettings, updateSettings } =
    useContext(settingsContext);
  const { getBeatmapSet } = useContext(BeatmapSetCacheContext);

  const { toast } = useToast();

  const { beatmapSetId, beatmapId, isOpen } = data as OpenGameOverlayData;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadBeatmap = async () => {
      try {
        const beatmapSetFile = await getBeatmapSet(beatmapSetId);

        setLoadingMessage("Parsing Beatmap...");

        const mapData = await parseOsz(beatmapSetFile, beatmapId);

        setMapData(mapData);
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
          <h1 className="text-5xl font-bold text-white">{loadingMessage}</h1>
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
