"use client";

import { Progress } from "@/components/ui/progress";
import { BeatmapData, parseOsz } from "@/lib/beatmapParser";
import { loadAssets } from "@/osuMania/assets";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useBeatmapSetCacheStore } from "../../stores/beatmapSetCacheStore";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { useStoredBeatmapSetsStore } from "../../stores/storedBeatmapSetsStore";
import GameScreens from "./gameScreens";

const GameModal = () => {
  const beatmapSet = useGameStore.use.beatmapSet();
  const beatmapId = useGameStore.use.beatmapId();
  const closeGame = useGameStore.use.closeGame();
  const uploadedBeatmapSet = useGameStore.use.uploadedBeatmapSet();
  const replayData = useGameStore.use.replayData();
  const storeDownloadedBeatmaps = useSettingsStore(
    (settings) => settings.storeDownloadedBeatmaps,
  );
  const backgroundDim = useSettingsStore.use.backgroundDim();
  const backgroundBlur = useSettingsStore.use.backgroundBlur();
  const getBeatmapSet = useBeatmapSetCacheStore.use.getBeatmapSet();
  const storedBeatmapSets = useStoredBeatmapSetsStore.use.storedBeatmapSets();
  const setStoredBeatmapSets =
    useStoredBeatmapSetsStore.use.setStoredBeatmapSets();
  const [beatmapData, setBeatmapData] = useState<BeatmapData | null>(null);
  const [key, setKey] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Downloading Beatmap...",
  );
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

          if (
            storeDownloadedBeatmaps &&
            !storedBeatmapSets.some(
              (storedBeatmapSet) => storedBeatmapSet.id === beatmapSet.id,
            )
          ) {
            setStoredBeatmapSets((draft) => {
              draft.push(beatmapSet);
            });
          }
        } catch (error: any) {
          toast("Download Error", {
            description: error.message,
            duration: 10000,
          });

          closeGame();
          return;
        }
      }

      try {
        setLoadingMessage("Parsing Beatmap...");

        const beatmap = beatmapSet.beatmaps.find(
          (beatmap) => beatmap.id === beatmapId,
        );

        if (!beatmap) {
          throw new Error(
            "Beatmap ID doesn't match any beatmaps (this should never happen)",
          );
        }

        const beatmapData = await parseOsz(
          beatmapSetFile,
          beatmap,
          replayData?.mods,
          replayData?.columnMap,
        );

        await loadAssets();

        setBeatmapData(beatmapData);
      } catch (error: any) {
        toast("Parsing Error", {
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
    getBeatmapSet,
    uploadedBeatmapSet,
    beatmapSet,
    storedBeatmapSets,
    setStoredBeatmapSets,
    storeDownloadedBeatmaps,
    replayData,
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

  const retry = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  return (
    <main id="game" className="relative grid">
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
                filter: `brightness(${1 - backgroundDim}) blur(${backgroundBlur * 30}px)`,
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
