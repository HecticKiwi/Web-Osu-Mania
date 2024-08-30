"use client";

import { BeatmapData, parseOsz } from "@/lib/beatmapParser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBeatmapSetCacheContext } from "../providers/beatmapSetCacheProvider";
import { useGameContext } from "../providers/gameOverlayProvider";
import { useSettingsContext } from "../providers/settingsProvider";
import { useToast } from "../ui/use-toast";
import GameScreens from "./gameScreens";

const GameModal = () => {
  const { data, closeGame } = useGameContext();
  const [beatmapData, setBeatmapData] = useState<BeatmapData | null>(null);
  const [key, setKey] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Downloading Beatmap...",
  );
  const { settings } = useSettingsContext();
  const { getBeatmapSet } = useBeatmapSetCacheContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!data) {
      return;
    }

    const loadBeatmap = async () => {
      let beatmapSetFile: Blob;
      try {
        beatmapSetFile = await getBeatmapSet(data.beatmapSetId);
      } catch (error: any) {
        toast({
          title: "Download Error",
          description: error.message,
          duration: 10000,
        });

        closeGame();
        return;
      }

      try {
        setLoadingMessage("Parsing Beatmap...");

        const beatmapData = await parseOsz(beatmapSetFile, data.beatmapId);

        setBeatmapData(beatmapData);
      } catch (error: any) {
        toast({
          title: "Parsing Error",
          description: "An error occurred while parsing the beatmap.",
          duration: 10000,
        });

        closeGame();
        return;
      }
    };

    loadBeatmap();
  }, [data, closeGame, toast, getBeatmapSet]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (beatmapData) {
        URL.revokeObjectURL(beatmapData.backgroundUrl);
        URL.revokeObjectURL(beatmapData.song.url!);

        Object.values(beatmapData.sounds).forEach((sound) => {
          if (sound.url) {
            URL.revokeObjectURL(sound.url);
          }
        });
      }
    };
  }, [beatmapData]);

  const retry = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <main className="relative grid">
      {!beatmapData && (
        <div className="flex w-full items-center text-center">
          <div className="h-[1px] grow bg-gradient-to-r from-transparent to-primary"></div>

          <div className="rounded-xl border bg-card p-3 sm:p-6">
            <h1 className="text-2xl text-white sm:text-4xl">
              {loadingMessage}
            </h1>
          </div>

          <div className="h-[1px] grow bg-gradient-to-l from-transparent to-primary"></div>
        </div>
      )}
      {beatmapData && (
        <>
          <Image
            src={beatmapData.backgroundUrl}
            alt="Beatmap Background"
            fill
            className="-z-[1] select-none object-cover"
            style={{
              filter: `brightness(${1 - settings.backgroundDim})`,
            }}
          />

          <GameScreens key={key} beatmapData={beatmapData} retry={retry} />
        </>
      )}
    </main>
  );
};

export default GameModal;
