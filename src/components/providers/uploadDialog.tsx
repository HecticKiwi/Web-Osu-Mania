import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { playAudioPreview, stopAudioPreview } from "@/lib/audio";
import { ExternalLink, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BeatmapList from "../beatmapSet/beatmapList";
import BeatmapSetCover from "../beatmapSet/beatmapSetCover";
import PreviewProgressBar from "../beatmapSet/previewProgressBar";
import SaveBeatmapSetButton from "../beatmapSet/saveBeatmapSetButton";
import { Button } from "../ui/button";
import { useGameContext } from "./gameProvider";
import { useSettingsContext } from "./settingsProvider";

const UploadDialog = () => {
  const { uploadedBeatmapSet, beatmapId, setUploadedBeatmapSet, beatmapSet } =
    useGameContext();
  const { settings } = useSettingsContext();
  const [preview, setPreview] = useState<Howl | null>(null);

  const stopPreview = () => {
    if (preview) {
      stopAudioPreview(preview);
      setPreview(null);
    }
  };

  useEffect(() => {
    if (uploadedBeatmapSet && beatmapSet) {
      const audio = playAudioPreview(beatmapSet.id, settings.musicVolume);
      setPreview(audio);
    }
  }, [beatmapSet, settings.musicVolume, uploadedBeatmapSet]);

  return (
    <>
      <Dialog
        open={!!uploadedBeatmapSet && !beatmapId}
        onOpenChange={(open) => {
          if (!open) {
            stopPreview();
            setUploadedBeatmapSet(null);
          }
        }}
      >
        <DialogContent
          className="gap-0 overflow-hidden p-0 focus:outline-none"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Beatmap Set Upload</DialogTitle>
          {uploadedBeatmapSet && !beatmapSet && (
            <div className="p-4">
              <h3 className="text-center text-2xl font-medium">
                Getting Beatmap Information...
              </h3>
              <Loader className="mx-auto mt-4 animate-spin" />
            </div>
          )}
          {uploadedBeatmapSet && beatmapSet && (
            <>
              <div className="group relative flex h-[150px] flex-col p-4 text-start">
                <BeatmapSetCover beatmapSet={beatmapSet} />

                {preview && (
                  <div className="absolute inset-x-0 bottom-0">
                    <PreviewProgressBar preview={preview} />
                  </div>
                )}

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

              <BeatmapList beatmapSet={beatmapSet} stopPreview={stopPreview} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadDialog;
