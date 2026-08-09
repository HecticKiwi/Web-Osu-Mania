import { NULL_OPTION } from "@/components/inputs/selectInput";
import FilterableList from "../filterableList";
import CustomSoundSelect from "./customSoundSelect";

const applauseOptions: { id: string | null; label: string }[] = [
  {
    id: NULL_OPTION,
    label: "None",
  },
  {
    id: "applause.mp3",
    label: "Default",
  },
  {
    id: "cytus2.wav",
    label: "Cytus 2",
  },
];

const failOptions: { id: string | null; label: string }[] = [
  {
    id: NULL_OPTION,
    label: "None",
  },
  {
    id: "failsound.mp3",
    label: "Default",
  },
  {
    id: "darkSouls.wav",
    label: "Dark Souls",
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
              soundKey="applause"
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
              soundKey="fail"
              options={failOptions}
            />
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default SoundSettings;
