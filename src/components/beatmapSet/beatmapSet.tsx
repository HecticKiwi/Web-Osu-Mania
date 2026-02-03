import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { playAudioPreview, stopAudioPreview } from "@/lib/audio";
import { BeatmapSet as BeatmapSetData } from "@/lib/osuApi";
import { useState } from "react";
import { useSettingsStore } from "../../stores/settingsStore";
import BeatmapList from "./beatmapList";
import BeatmapSetPageButton from "./beatmapPageButton";
import BeatmapSetCover from "./beatmapSetCover";
import IndexedDbButton from "./indexedDbButton";
import PreviewProgressBar from "./previewProgressBar";
import SaveBeatmapSetButton from "./saveBeatmapSetButton";

const BeatmapSet = ({ beatmapSet }: { beatmapSet: BeatmapSetData }) => {
  const [preview, setPreview] = useState<Howl | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      playPreview();
    } else {
      stopPreview();
    }
  };

  const playPreview = () => {
    const musicVolume = useSettingsStore.getState().musicVolume;
    const audio = playAudioPreview(beatmapSet.id, musicVolume);
    setPreview(audio);
  };

  const stopPreview = () => {
    if (preview) {
      stopAudioPreview(preview);
      setPreview(null);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <div className="group relative">
        <PopoverTrigger className="group-hover:border-primary relative flex h-[150px] w-full flex-col overflow-hidden rounded-xl border p-4 text-start transition-colors duration-300">
          <BeatmapSetCover beatmapSet={beatmapSet} />

          {preview && (
            <div className="absolute inset-x-0 bottom-0">
              <PreviewProgressBar preview={preview} />
            </div>
          )}
        </PopoverTrigger>

        <div className="absolute top-4 left-4 flex gap-2">
          <IndexedDbButton beatmapSet={beatmapSet} />
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <SaveBeatmapSetButton beatmapSet={beatmapSet} />

          <BeatmapSetPageButton beatmapSetId={beatmapSet.id} />
        </div>
      </div>

      <PopoverContent className="p-0">
        <BeatmapList beatmapSet={beatmapSet} stopPreview={stopPreview} />
      </PopoverContent>
    </Popover>
  );
};

export default BeatmapSet;
