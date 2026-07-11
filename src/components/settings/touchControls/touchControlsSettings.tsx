import RadioGroupInput from "@/components/inputs/radioGroupInput";
import SliderInput from "@/components/inputs/sliderInput";
import SwitchInput from "@/components/inputs/switchInput";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { TouchMode } from "@/stores/settingsStore";
import { touchModes, useSettingsStore } from "@/stores/settingsStore";
import FilterableList from "../filterableList";

const TouchControlsSettings = ({ searchQuery }: { searchQuery?: string }) => {
  const setSettings = useSettingsStore.use.setSettings();

  return (
    <FilterableList
      title="Touch Controls"
      items={[
        {
          label: "Enable Touch Controls",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="touch.enabled"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.touch.enabled = checked;
                })
              }
            />
          ),
        },
        {
          label: "Mode",
          searchTags: touchModes,
          render: ({ label }) => (
            <RadioGroupInput
              label={label}
              settingPath="touch.mode"
              onValueChange={(value: TouchMode) =>
                setSettings((draft) => {
                  draft.touch.mode = value;
                })
              }
              className="space-y-2"
            >
              {touchModes.map((touchMode) => (
                <Label
                  key={touchMode}
                  htmlFor={touchMode}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem value={touchMode} id={touchMode} />
                  <span className="flex gap-2">
                    {capitalizeFirstLetter(touchMode)}
                  </span>
                </Label>
              ))}
            </RadioGroupInput>
          ),
        },
        {
          label: "Border Opacity",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="touch.borderOpacity"
              tooltip={(borderOpacity) => {
                return `${Math.round(borderOpacity * 100)}%`;
              }}
              onValueChange={([borderOpacity]) =>
                setSettings((draft) => {
                  draft.touch.borderOpacity = borderOpacity;
                })
              }
              min={0}
              max={1}
              step={0.01}
            />
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default TouchControlsSettings;
