"use client";

import { Progress } from "@/components/ui/progress";
import { BeatmapData, parseOsz } from "@/lib/beatmapParser";
import { loadAssets } from "@/osuMania/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBeatmapSetCacheContext } from "../providers/beatmapSetCacheProvider";
import { useGameContext } from "../providers/gameProvider";
import { useSettingsContext } from "../providers/settingsProvider";
import { useToast } from "../ui/use-toast";
import GameScreens from "./gameScreens";

const GameModal = () => {
  const { beatmapId, beatmapSet, closeGame, uploadedBeatmapSet } =
    useGameContext();
  const [beatmapData, setBeatmapData] = useState<BeatmapData | null>(null);
  const [key, setKey] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Downloading Beatmap...",
  );
  const { settings } = useSettingsContext();
  const { getBeatmapSet } = useBeatmapSetCacheContext();
  const { toast } = useToast();
  const [downloadPercent, setDownloadPercent] = useState(0);

  useEffect(() => {
    if (!beatmapId) {
      return;
    }

    const loadBeatmap = async () => {
      let beatmapSetFile: Blob;

      if (!beatmapSet) {
        throw new Error("beatmapSet is null (this shouldn't happen)");
      }

      if (uploadedBeatmapSet) {
        beatmapSetFile = uploadedBeatmapSet;
      } else {
        try {
          beatmapSetFile = await getBeatmapSet(
            beatmapSet.id,
            setDownloadPercent,
          );
        } catch (error: any) {
          toast({
            title: "Download Error",
            description: error.message,
            duration: 10000,
          });

          closeGame();
          return;
        }
      }

      try {
        setLoadingMessage("Parsing Beatmap...");

        const beatmapData = await parseOsz(beatmapSetFile, beatmapId);

        await loadAssets();

        setBeatmapData(beatmapData);
      } catch (error: any) {
        toast({
          title: "Parsing Error",
          description: error.message,
          duration: 10000,
        });

        closeGame();
        return;
      }
    };

    loadBeatmap();
  }, [
    beatmapId,
    closeGame,
    toast,
    getBeatmapSet,
    uploadedBeatmapSet,
    beatmapSet,
  ]);

  // Clean up object URLs
  useEffect(() => {
    if (!beatmapData) {
      return;
    }

    return () => {
      if (beatmapData.backgroundUrl) {
        URL.revokeObjectURL(beatmapData.backgroundUrl);
      }

      URL.revokeObjectURL(beatmapData.song.url);

      Object.values(beatmapData.sounds).forEach((sound) => {
        if (sound.url) {
          URL.revokeObjectURL(sound.url);
        }
      });
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

            {loadingMessage.includes("Downloading") && (
              <Progress value={downloadPercent} className="mt-3 h-2" />
            )}
          </div>

          <div className="h-[1px] grow bg-gradient-to-l from-transparent to-primary"></div>
        </div>
      )}
      {beatmapData && (
        <>
          {beatmapData.backgroundUrl && (
            <Image
              src={beatmapData.backgroundUrl}
              alt="Beatmap Background"
              fill
              className="-z-[1] select-none object-cover"
              style={{
                filter: `brightness(${1 - settings.backgroundDim}) blur(${settings.backgroundBlur * 30}px)`,
              }}
            />
          )}

          <GameScreens key={key} beatmapData={beatmapData} retry={retry} />
        </>
      )}
    </main>
  );
};

export default GameModal;
