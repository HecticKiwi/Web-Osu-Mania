"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { playAudioPreview, stopAudioPreview } from "@/lib/audio";
import { BeatmapSet as BeatmapSetData } from "@/lib/osuApi";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BeatmapList from "../beatmapList";
import { useGameContext } from "../providers/gameProvider";
import { useSettingsContext } from "../providers/settingsProvider";
import { Button } from "../ui/button";
import BeatmapSetCover from "./beatmapSetCover";
import PreviewProgressBar from "./previewProgressBar";
import SaveBeatmapSetButton from "./saveBeatmapSetButton";

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
      <div className="group relative">
        <PopoverTrigger className="relative flex h-[150px] w-full flex-col overflow-hidden rounded-xl border p-4 text-start transition-colors duration-300 group-hover:border-primary">
          <BeatmapSetCover beatmapSet={beatmapSet} />

          {preview && (
            <div className="absolute inset-x-0 bottom-0">
              <PreviewProgressBar preview={preview} />
            </div>
          )}
        </PopoverTrigger>

        <div className="absolute right-4 top-4 flex gap-2">
          <SaveBeatmapSetButton beatmapSet={beatmapSet} />

          <Button
            asChild
            variant={"secondary"}
            size={"icon"}
            className="h-8 w-8 bg-secondary/60 focus-within:bg-secondary hover:bg-secondary"
            title="Go to osu! beatmap page"
          >
            <Link
              href={`https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
              target="_blank"
              prefetch={false}
            >
              <ExternalLink className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

      <PopoverContent className="p-0">
        <BeatmapList beatmapSet={beatmapSet} stopPreview={stopPreview} />
      </PopoverContent>
    </Popover>
  );
};

export default BeatmapSet;
