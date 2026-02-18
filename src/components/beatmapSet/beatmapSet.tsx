import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { playAudioPreview, stopAudioPreview } from "@/lib/audio";
import type { BeatmapSet as BeatmapSetData } from "@/lib/osuApi";
import { getBeatmapSet } from "@/lib/osuApi";
import { parseCategoryParam } from "@/lib/searchParams/categoryParam";
import { Route } from "@/routes";
import { useSavedBeatmapSetsStore } from "@/stores/savedBeatmapSetsStore";
import { useStoredBeatmapSetsStore } from "@/stores/storedBeatmapSetsStore";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSettingsStore } from "../../stores/settingsStore";
import BeatmapList from "./beatmapList";
import BeatmapSetPageButton from "./beatmapPageButton";
import BeatmapSetCover from "./beatmapSetCover";
import IndexedDbButton from "./indexedDbButton";
import PreviewProgressBar from "./previewProgressBar";
import SaveBeatmapSetButton from "./saveBeatmapSetButton";

const BeatmapSet = ({ beatmapSet }: { beatmapSet: BeatmapSetData }) => {
  const search = Route.useSearch();
  const category = parseCategoryParam(search.category);
  const setStoredBeatmapSets =
    useStoredBeatmapSetsStore.use.setStoredBeatmapSets();
  const setSavedBeatmapSets =
    useSavedBeatmapSetsStore.use.setSavedBeatmapSets();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<Howl | null>(null);

  const handleOpenChange = async (isOpen: boolean) => {
    if (isOpen) {
      playPreview();

      // If the category is "Saved" or "Stored", fetch the beatmap set data
      // in case the stored data is out of date
      if (category === "Saved" || category === "Stored") {
        const beatmapSetData = await queryClient.fetchQuery({
          queryKey: ["beatmapSets", beatmapSet.id],
          queryFn: () => getBeatmapSet(beatmapSet.id),
          staleTime: Infinity,
          retry: 1,
        });

        if (category === "Saved") {
          setSavedBeatmapSets((draft) => {
            const index = draft.findIndex((set) => set.id === beatmapSet.id);
            draft.splice(index, 1, beatmapSetData);
          });
        } else {
          setStoredBeatmapSets((draft) => {
            const index = draft.findIndex((set) => set.id === beatmapSet.id);
            draft.splice(index, 1, beatmapSetData);
          });
        }
      }
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
        <PopoverTrigger className="group-hover:border-primary relative flex h-37.5 w-full flex-col overflow-hidden rounded-xl border p-4 text-start transition-colors duration-300">
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
