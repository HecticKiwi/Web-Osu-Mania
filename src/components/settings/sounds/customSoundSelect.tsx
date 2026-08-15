import SelectInput, { NULL_OPTION } from "@/components/inputs/selectInput";
import { Button } from "@/components/ui/button";
import { SelectItem, SelectSeparator } from "@/components/ui/select";
import { idb } from "@/lib/idb";
import { BASE_PATH } from "@/lib/utils";
import type { Settings } from "@/stores/settingsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { Howl } from "howler";
import { Pencil, Play } from "lucide-react";
import { toast } from "sonner";

export const CUSTOM_SOUND_OPTION = "custom";

const CustomSoundSelect = ({
  label,
  settingPath,
  soundGroup,
  soundName,
  options,
}: {
  label: string;
  settingPath: keyof Settings | (string & {});
  soundGroup: "applause" | "fail" | "hitsounds";
  soundName: keyof Settings["skin"]["sounds"];
  options: { id: string | null; label: string }[];
}) => {
  const setSettings = useSettingsStore.use.setSettings();
  const sfxVolume = useSettingsStore.use.sfxVolume();

  const selectFile = () =>
    new Promise<File | null>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "audio/*";
      input.onchange = () => {
        const file = input.files?.[0] ?? null;
        input.remove();
        resolve(file);
      };
      input.click();
    });

  const uploadCustomSound = async () => {
    const file = await selectFile();
    if (!file) return;

    await idb.saveCustomSound(soundName, file);

    setSettings((draft) => {
      draft.skin.sounds[soundName] = CUSTOM_SOUND_OPTION;
    });
  };

  const playSound = async (value: string) => {
    if (value === NULL_OPTION) return;

    Howler.stop();

    let url: string;
    if (value === CUSTOM_SOUND_OPTION) {
      const customSound = await idb.getCustomSound(soundName);
      if (!customSound) {
        toast.error("Custom sound not found.");
        return;
      }

      const file = customSound.file as File;
      const format = file.name.split(".").pop();
      url = `${URL.createObjectURL(customSound.file)}#.${format}`;
    } else {
      url = `${BASE_PATH}/skin/sounds/${soundGroup}/${value}`;
    }

    const revokeUrl = () => {
      if (value === CUSTOM_SOUND_OPTION) {
        URL.revokeObjectURL(url);
      }
    };

    new Howl({
      src: [url],
      html5: true,
      autoplay: true,
      volume: sfxVolume,
      onloaderror: () => {
        toast.error("Failed to load sound preview.");
        revokeUrl();
      },
      onend: revokeUrl,
    });
  };

  const handleValueChange = async (value: string | typeof NULL_OPTION) => {
    if (value === CUSTOM_SOUND_OPTION) {
      const customSound = await idb.getCustomSound(soundName);

      if (!customSound) {
        // Set the value to "custom" only if a file is actually uploaded
        uploadCustomSound();
        return;
      }
    }

    setSettings((draft) => {
      if (value === NULL_OPTION) {
        draft.skin.sounds[soundName] = null;
      } else {
        draft.skin.sounds[soundName] = value;
      }
    });
  };

  return (
    <SelectInput
      label={label}
      settingPath={settingPath}
      onValueChange={handleValueChange}
      rightElement={(value) => {
        if (value && value !== NULL_OPTION) {
          return (
            <Button
              variant="outline"
              size="icon"
              onClick={() => playSound(value)}
              className="shrink-0"
            >
              <Play className="size-4" />
            </Button>
          );
        }

        return null;
      }}
    >
      {options.map((option) => (
        <SelectItem
          key={option.id}
          value={option.id?.toString() ?? NULL_OPTION}
        >
          {option.label}
        </SelectItem>
      ))}
      <SelectSeparator />
      <div className="flex gap-1">
        <SelectItem
          key={CUSTOM_SOUND_OPTION}
          value={CUSTOM_SOUND_OPTION}
          className="pr-6"
        >
          Custom
        </SelectItem>

        <Button
          variant="outline"
          size="icon"
          onClick={uploadCustomSound}
          className="shrink-0"
          title="Edit custom sound"
        >
          <Pencil className="size-4" />
        </Button>
      </div>
    </SelectInput>
  );
};

export default CustomSoundSelect;
