import SliderInput from "@/components/inputs/sliderInput";
import SwitchInput from "@/components/inputs/switchInput";
import { useSettingsStore } from "@/stores/settingsStore";
import FilterableList from "../filterableList";
import type { SettingsSectionProps } from "../settingsTab";

const GeneralSettings = ({ title, searchQuery }: SettingsSectionProps) => {
  const setSettings = useSettingsStore.use.setSettings();
  const hideBeatmapSetCovers = useSettingsStore.use.hideBeatmapSetCovers();

  return (
    <FilterableList
      className="mt-0"
      title={title}
      items={[
        {
          label: "Website Color",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="hue"
              graphic={(hue) => (
                <div
                  className="size-6 shrink-0 rounded-full"
                  style={{ backgroundColor: `hsl(${hue}, 80%, 69%)` }}
                ></div>
              )}
              tooltip={(hue) => hue}
              onValueChange={([hue]) =>
                setSettings((draft) => {
                  draft.hue = hue;
                })
              }
              min={0}
              max={360}
              step={1}
            />
          ),
        },
        {
          label: "Prefer Metadata in Original Language",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="preferMetadataInOriginalLanguage"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.preferMetadataInOriginalLanguage = checked;
                })
              }
            />
          ),
        },
        {
          label: "Hide Beatmap Set Covers",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="hideBeatmapSetCovers"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.hideBeatmapSetCovers = checked;
                })
              }
              description={
                hideBeatmapSetCovers &&
                "If you would also like to hide the background during gameplay, set the background dim to 100%."
              }
            />
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default GeneralSettings;
