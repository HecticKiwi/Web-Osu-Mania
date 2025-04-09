import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Loader } from "lucide-react";
import Link from "next/link";
import ManiaIcon from "../maniaIcon";
import { BeatmapSet, Beatmap } from "@/lib/osuApi";
import BeatmapSetCover from "../beatmapSet/beatmapSetCover";
import SaveBeatmapSetButton from "../beatmapSet/saveBeatmapSetButton";
import { Button } from "../ui/button";
import { useGameContext } from "./gameProvider";
import { ReplayData } from "@/osuMania/systems/replay";

const ReplayUploadDialog = () => {
  const { beatmapId, beatmapSet, setUploadedReplay, uploadedReplay, replay } =
    useGameContext();
  const { startGame } = useGameContext();

  const BeatmapList = ({
    beatmapSet,
    replay
  }: {
    beatmapSet: BeatmapSet;
    replay: ReplayData;
  }) => {

    const maniaBeatmaps = beatmapSet.beatmaps.filter(
      (beatmap) => beatmap.mode === "mania",
    );

    if (maniaBeatmaps.length === 0) {
      return (
        <div className="flex max-h-[500px] flex-col gap-2 overflow-hidden rounded-xl">
          <div className="flex flex-col gap-2 overflow-auto p-2 scrollbar scrollbar-track-card">
            <p className="text-balance p-4 text-center text-muted-foreground">
              This beatmap set doesn't have any osu!mania beatmaps.
            </p>
          </div>
        </div>
      );
    }

    const filteredBeatmaps = maniaBeatmaps
      .filter(
        (beatmap) => beatmap.id.toString() == replay.beatmapData.beatmapId,
      );

    return (
      <div className="flex max-h-[500px] flex-col gap-2 overflow-hidden rounded-xl">
        <div className="flex flex-col gap-2 overflow-auto p-2 scrollbar scrollbar-track-card">
          {filteredBeatmaps.length === 0 && (
            <p className="text-balance p-4 text-center text-muted-foreground">
              No beatmaps found matching your filters. Please adjust or{" "}
              <Link href={"/"} className="text-primary focus-within:underline">
                reset
              </Link>{" "}
              your filters.
            </p>
          )}
          {filteredBeatmaps.length > 0 &&
            filteredBeatmaps
              .sort((a, b) => a.difficulty_rating - b.difficulty_rating)
              .map((beatmap) => {

                return (
                  <button
                    key={beatmap.id}
                    className="flex items-center gap-3 rounded p-2 text-start transition hover:bg-white/5"
                    onClick={() => {
                      startGame(beatmap.id);
                    }}
                  >
                    <ManiaIcon
                      difficultyRating={beatmap.difficulty_rating}
                      className="shrink-0"
                    />

                    <div className="grow">
                      <p className="line-clamp-1">{beatmap.version}</p>

                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">
                          {beatmap.difficulty_rating.toFixed(2)}★
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog
        open={!!uploadedReplay && !beatmapId}
        onOpenChange={(open) => {
          if (!open) {
            setUploadedReplay(null);
          }
        }}
      >
        <DialogContent
          className="gap-0 overflow-hidden p-0 focus:outline-none"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Replay Upload</DialogTitle>
          {uploadedReplay && !beatmapSet && (
            <div className="p-4">
              <h3 className="text-center text-2xl font-medium">
                Getting Beatmap Information...
              </h3>
              <Loader className="mx-auto mt-4 animate-spin" />
            </div>
          )}
          {uploadedReplay && beatmapSet && (
            <>
              <div className="group relative flex h-[150px] flex-col p-4 text-start">
                <BeatmapSetCover beatmapSet={beatmapSet} />

                <div className="absolute right-4 top-4 flex gap-2">
                  <SaveBeatmapSetButton beatmapSet={beatmapSet} />

                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant={"secondary"}
                          size={"icon"}
                          className="h-8 w-8 bg-secondary/60 focus-within:bg-secondary hover:bg-secondary"
                        >
                          <Link
                            href={`https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
                            target="_blank"
                            prefetch={false}
                          >
                            <ExternalLink className="size-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Go to osu! Beatmap Page</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              {/* Play Beatmap button here*/}
              {replay && BeatmapList({ beatmapSet, replay })}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReplayUploadDialog;
