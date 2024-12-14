import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { playAudioPreview, stopAudioPreview } from "@/lib/audio";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import BeatmapList from "../beatmapList";
import BeatmapSetCover from "../beatmapSetCover";
import { useGameContext } from "./gameProvider";
import { useSettingsContext } from "./settingsProvider";

const UploadDialog = () => {
  const { uploadedBeatmapSet, beatmapId, setUploadedBeatmapSet, beatmapSet } =
    useGameContext();
  const { settings } = useSettingsContext();
  const [audio, setAudio] = useState<Howl | null>(null);

  const stopPreview = () => {
    if (audio) {
      stopAudioPreview(audio);
      setAudio(null);
    }
  };

  useEffect(() => {
    if (uploadedBeatmapSet && beatmapSet) {
      const audio = playAudioPreview(beatmapSet.id, settings.musicVolume);
      setAudio(audio);
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
              <div className="relative flex h-[150px] flex-col p-4 text-start">
                <BeatmapSetCover beatmapSet={beatmapSet} />
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
