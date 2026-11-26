import { Progress } from "@/components/ui/progress";
import type { BeatmapData } from "@/lib/beatmapParser";
import { parseOsz } from "@/lib/beatmapParser";
import { generateAutoReplay } from "@/lib/replay";
import { loadAssets } from "@/osuMania/assets";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const localReplayBeatmapSet = useGameStore.use.localReplayBeatmapSet();
  const storeDownloadedBeatmaps = useSettingsStore(
    (settings) => settings.storeDownloadedBeatmaps,
  );
  const backgroundDim = useSettingsStore.use.backgroundDim();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const getBeatmapSet = useBeatmapSetCacheStore.use.getBeatmapSet();
  const setStoredBeatmapSets =
    useStoredBeatmapSetsStore.use.setStoredBeatmapSets();
  const replayData = useGameStore.use.replayData();
  const setReplayData = useGameStore.use.setReplayData();
  const mods = useSettingsStore.use.mods();
  const [beatmapData, setBeatmapData] = useState<BeatmapData | null>(null);
  const [key, setKey] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Downloading Beatmap...",
  );
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [showHud, setShowHud] = useState(true);

  // Prevent user from selecting while game is open
  useEffect(() => {
    document.body.classList.add("select-none");

    return () => {
      document.body.classList.remove("select-none");
    };
  }, []);

  // Fetch beatmap and parse data
  useEffect(() => {
    if (!beatmapId) {
      return;
    }

    // Set when the effect re-runs or unmounts, so a stale load can't
    // overwrite a newer one with its own beatmapData
    let cancelled = false;

    const loadBeatmap = async () => {
      let beatmapSetFile: Blob;

      if (!beatmapSet) {
        throw new Error("beatmapSet is null (this shouldn't happen)");
      }

      if (uploadedBeatmapSet) {
        beatmapSetFile = uploadedBeatmapSet;
      } else if (localReplayBeatmapSet) {
        beatmapSetFile = localReplayBeatmapSet;
      } else {
        try {
          beatmapSetFile = await getBeatmapSet(
            beatmapSet.id,
            setDownloadPercent,
          );

          if (cancelled) {
            return;
          }

          // Read the store directly instead of subscribing to it. Adding the
          // set below would otherwise re-run this effect and load the beatmap
          // a second time.
          const { storedBeatmapSets } = useStoredBeatmapSetsStore.getState();

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
          if (cancelled) {
            return;
          }

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

        const beatmap = beatmapSet.beatmaps.find((b) => b.id === beatmapId);

        if (!beatmap) {
          throw new Error(
            "Beatmap ID doesn't match any beatmaps (this should never happen)",
          );
        }

        // Don't use the hook.
        // This useEffect should run only once regardless of whether replayData is changed.
        const replay = useGameStore.getState().replayData;

        const parsedBeatmapData = await parseOsz(
          beatmapSetFile,
          beatmap,
          replay?.mods,
          replay?.columnMap,
          beatmapSet.status === "local",
        );

        if (cancelled) {
          return;
        }

        // If autoplay is enabled and we're not already watching a replay, use a perfect replay
        if (!replay && mods.autoplay) {
          const autoReplay = generateAutoReplay(
            parsedBeatmapData,
            parsedBeatmapData.beatmapHash,
            mods,
          );

          setReplayData(autoReplay);
        }

        await loadAssets();

        if (cancelled) {
          return;
        }

        setBeatmapData(parsedBeatmapData);
      } catch (error: any) {
        if (cancelled) {
          return;
        }

        toast("Parsing Error", {
          description: error.message,
          duration: 10000,
        });

        closeGame();
        return;
      }
    };

    loadBeatmap();

    return () => {
      cancelled = true;
    };
  }, [
    beatmapId,
    closeGame,
    getBeatmapSet,
    uploadedBeatmapSet,
    localReplayBeatmapSet,
    beatmapSet,
    setStoredBeatmapSets,
    storeDownloadedBeatmaps,
    setReplayData,
    mods,
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

      if (beatmapData.videoUrl) {
        URL.revokeObjectURL(beatmapData.videoUrl);
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
    <div id="game" className="relative grid">
      {!beatmapData && (
        <div className="flex w-full items-center text-center">
          <div className="to-primary h-px grow bg-linear-to-r from-transparent"></div>

          <div className="bg-card rounded-xl border p-3 sm:p-6">
            <h1 className="text-2xl text-white sm:text-4xl">
              {loadingMessage}
            </h1>

            {loadingMessage.includes("Downloading") && (
              <Progress value={downloadPercent} className="mt-3 h-2" />
            )}
          </div>

          <div className="to-primary h-px grow bg-linear-to-l from-transparent"></div>
        </div>
      )}
      {beatmapData && (
        <>
          {beatmapData.videoUrl && (
            <video
              ref={videoRef}
              src={beatmapData.videoUrl}
              muted
              className="h-full w-full object-cover"
              style={{
                filter: `brightness(${1 - backgroundDim})`,
              }}
            />
          )}

          <GameScreens
            key={key}
            beatmapData={beatmapData}
            replayData={replayData}
            retry={retry}
            videoRef={videoRef}
            showHud={showHud}
            setShowHud={setShowHud}
          />
        </>
      )}
    </div>
  );
};

export default GameModal;
