import { NULL_OPTION } from "@/components/inputs/selectInput";
import { hitsoundSampleSets, hitsoundSamples } from "@/lib/skinParser";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { FilterableItem } from "../filterableList";
import FilterableList from "../filterableList";
import CustomSoundSelect from "./customSoundSelect";
import SkinUpload from "./skinUpload";

const applauseOptions: { id: string | null; label: string }[] = [
  {
    id: NULL_OPTION,
    label: "None",
  },
  {
    id: "applause-1.mp3",
    label: "Applause",
  },
];

const failOptions: { id: string | null; label: string }[] = [
  {
    id: NULL_OPTION,
    label: "None",
  },
  {
    id: "power-down-1.mp3",
    label: "Power Down",
  },
];

const hitsoundOptions: { id: string | null; label: string }[] = [
  {
    id: NULL_OPTION,
    label: "None",
  },
  {
    id: "clack-1.ogg",
    label: "Clack",
  },
  {
    id: "tock-1.ogg",
    label: "Tock 1",
  },
  {
    id: "tock-2.wav",
    label: "Tock 2",
  },
  {
    id: "snap-1.wav",
    label: "Snap",
  },
];

const SoundSettings = ({ searchQuery }: { searchQuery?: string }) => {
  return (
    <FilterableList
      title="Sounds"
      items={[
        {
          label: "Applause",
          render: ({ label }) => (
            <CustomSoundSelect
              label={label}
              settingPath="skin.sounds.applause"
              soundGroup="applause"
              soundName="applause"
              options={applauseOptions}
            />
          ),
        },
        {
          label: "Fail",
          render: ({ label }) => (
            <CustomSoundSelect
              label={label}
              settingPath="skin.sounds.fail"
              soundGroup="fail"
              soundName="fail"
              options={failOptions}
            />
          ),
        },
        ...hitsoundSampleSets.flatMap((group) => {
          return hitsoundSamples.map((sample) => {
            const filterableItem: FilterableItem = {
              label: `${capitalizeFirstLetter(group)}: ${capitalizeFirstLetter(sample)}`,
              render: ({ label }) => (
                <CustomSoundSelect
                  label={label}
                  settingPath={`skin.sounds.${group}-${sample}`}
                  soundGroup={`hitsounds`}
                  soundName={`${group}-${sample}`}
                  options={hitsoundOptions}
                />
              ),
            };

            return filterableItem;
          });
        }),
        {
          label: "Upload Skin",
          render: () => (
            <>
              <div className="grid grid-cols-2 items-center">
                <div className="text-muted-foreground text-sm font-semibold">
                  Upload Skin
                </div>

                <SkinUpload />
              </div>

              <p className="text-muted-foreground mt-4 text-sm">
                You can upload a skin file (.osk format) to import its
                hitsounds. Click the dashed box or drag a beatmap file into it.
              </p>
            </>
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default SoundSettings;
