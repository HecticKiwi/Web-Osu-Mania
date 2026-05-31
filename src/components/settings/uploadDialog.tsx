import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  playAudioPreview,
  playAudioPreviewFromUrl,
  stopAudioPreview,
} from "@/lib/audio";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import BeatmapList from "../beatmapSet/beatmapList";
import BeatmapSetPageButton from "../beatmapSet/beatmapPageButton";
import BeatmapSetCover from "../beatmapSet/beatmapSetCover";
import PreviewProgressBar from "../beatmapSet/previewProgressBar";

const UploadDialog = () => {
  const uploadedBeatmapSet = useGameStore.use.uploadedBeatmapSet();
  const beatmapSet = useGameStore.use.beatmapSet();
  const beatmapId = useGameStore.use.beatmapId();
  const replayData = useGameStore.use.replayData();
  const setUploadedBeatmapSet = useGameStore.use.setUploadedBeatmapSet();
  const musicVolume = useSettingsStore.use.musicVolume();
  const [preview, setPreview] = useState<Howl | null>(null);

  const stopPreview = () => {
    if (preview) {
      stopAudioPreview(preview);
      setPreview(null);
    }
  };

  useEffect(() => {
    if (!uploadedBeatmapSet || !beatmapSet || replayData) {
      return;
    }

    let audio: Howl | null = null;
    if (beatmapSet.previewUrl) {
      audio = playAudioPreviewFromUrl(beatmapSet.previewUrl, musicVolume);
    } else if (beatmapSet.id > 0) {
      audio = playAudioPreview(beatmapSet.id, musicVolume);
    }

    if (audio) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(audio);
    }
  }, [beatmapSet, musicVolume, replayData, uploadedBeatmapSet]);

  return (
    <>
      <Dialog
        open={!!uploadedBeatmapSet && !beatmapId && !replayData}
        onOpenChange={(open) => {
          if (!open) {
            stopPreview();
            setUploadedBeatmapSet(null);

            if (beatmapSet) {
              if (beatmapSet.coverUrl) {
                URL.revokeObjectURL(beatmapSet.coverUrl);
              }

              if (beatmapSet.previewUrl) {
                URL.revokeObjectURL(beatmapSet.previewUrl);
              }
            }
          }
        }}
      >
        <DialogContent
          className="gap-0 overflow-hidden p-0 focus:outline-hidden"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Beatmap Set Upload</DialogTitle>
          {uploadedBeatmapSet && !beatmapSet && !replayData && (
            <div className="p-4">
              <h3 className="text-center text-2xl font-medium">
                Getting Beatmap Information...
              </h3>
              <Loader className="mx-auto mt-4 animate-spin" />
            </div>
          )}
          {uploadedBeatmapSet && beatmapSet && !replayData && (
            <>
              <div className="group relative flex h-37.5 flex-col p-4 text-start">
                <BeatmapSetCover beatmapSet={beatmapSet} />

                {preview && (
                  <div className="absolute inset-x-0 bottom-0">
                    <PreviewProgressBar preview={preview} />
                  </div>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  {beatmapSet.status !== "local" && (
                    <BeatmapSetPageButton beatmapSetId={beatmapSet.id} />
                  )}
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
