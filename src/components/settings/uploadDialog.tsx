"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { playAudioPreview, stopAudioPreview } from "@/lib/audio";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import BeatmapList from "../beatmapSet/beatmapList";
import BeatmapSetPageButton from "../beatmapSet/beatmapPageButton";
import BeatmapSetCover from "../beatmapSet/beatmapSetCover";
import PreviewProgressBar from "../beatmapSet/previewProgressBar";
import SaveBeatmapSetButton from "../beatmapSet/saveBeatmapSetButton";

const UploadDialog = () => {
  const uploadedBeatmapSet = useGameStore.use.uploadedBeatmapSet();
  const beatmapSet = useGameStore.use.beatmapSet();
  const beatmapId = useGameStore.use.beatmapId();
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
    if (uploadedBeatmapSet && beatmapSet) {
      const audio = playAudioPreview(beatmapSet.id, musicVolume);
      setPreview(audio);
    }
  }, [beatmapSet, musicVolume, uploadedBeatmapSet]);

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

                  <BeatmapSetPageButton beatmapSetId={beatmapSet.id} />
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
