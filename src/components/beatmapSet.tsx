"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { playAudioPreview, stopAudioPreview } from "@/lib/audio";
import { BeatmapSet as BeatmapSetData } from "@/lib/osuApi";
import { useState } from "react";
import BeatmapList from "./beatmapList";
import BeatmapSetCover from "./beatmapSetCover";
import { useGameContext } from "./providers/gameProvider";
import { useSettingsContext } from "./providers/settingsProvider";

const BeatmapSet = ({ beatmapSet }: { beatmapSet: BeatmapSetData }) => {
  const { setBeatmapSet, beatmapId } = useGameContext();
  const { settings } = useSettingsContext();
  const [preview, setPreview] = useState<Howl | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setBeatmapSet(beatmapSet);

      playPreview();
    } else {
      // If popover is closed without selecting any diff
      if (!beatmapId) {
        setBeatmapSet(null);
      }

      stopPreview();
    }
  };

  const playPreview = () => {
    const audio = playAudioPreview(beatmapSet.id, settings.musicVolume);
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
      <PopoverTrigger asChild>
        <button className="group relative flex h-[150px] flex-col overflow-hidden rounded-xl border p-4 text-start transition-colors duration-300 focus-within:border-primary hover:border-primary">
          <BeatmapSetCover beatmapSet={beatmapSet} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <BeatmapList beatmapSet={beatmapSet} stopPreview={stopPreview} />
      </PopoverContent>
    </Popover>
  );
};

export default BeatmapSet;
