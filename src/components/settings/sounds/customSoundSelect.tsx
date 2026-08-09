import SelectInput, { NULL_OPTION } from "@/components/inputs/selectInput";
import { Button } from "@/components/ui/button";
import { SelectItem, SelectSeparator } from "@/components/ui/select";
import { idb } from "@/lib/idb";
import { BASE_PATH } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { Howl } from "howler";
import { Pencil, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CUSTOM_OPTION = "custom";

const CustomSoundSelect = ({
  label,
  settingPath,
  soundKey,
  options,
}: {
  label: string;
  settingPath: "skin.sounds.applause" | "skin.sounds.fail";
  soundKey: "applause" | "fail";
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

    await idb.saveCustomSound(soundKey, file);

    setSettings((draft) => {
      draft.skin.sounds[soundKey] = CUSTOM_OPTION;
    });
  };

  const playSound = async (value: string) => {
    if (value === NULL_OPTION) return;

    Howler.stop();
    let soundUrl: string;
    if (value === CUSTOM_OPTION) {
      const customSound = await idb.getCustomSound(soundKey);
      if (!customSound) {
        toast.error("Custom sound not found.");
        return;
      }
      soundUrl = URL.createObjectURL(customSound.file);
    } else {
      soundUrl = `${BASE_PATH}/skin/sounds/${soundKey}/${value}`;
    }

    const revokeUrl = () => {
      if (value === CUSTOM_OPTION) {
        URL.revokeObjectURL(soundUrl);
      }
    };

    new Howl({
      src: [soundUrl],
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

  const deleteCustomSound = async () => {
    await idb.deleteCustomSound(soundKey);
    setSettings((draft) => {
      draft.skin.sounds[soundKey] = null;
    });
    toast.success("Custom sound deleted.");
  };

  const handleValueChange = (value: string | typeof NULL_OPTION) => {
    if (value === CUSTOM_OPTION) {
      // Only set the value to "custom" if a file is actually selected
      uploadCustomSound();
      return;
    }

    setSettings((draft) => {
      if (value === NULL_OPTION) {
        draft.skin.sounds[soundKey] = null;
      } else {
        draft.skin.sounds[soundKey] = value;
      }
    });
  };

  return (
    <SelectInput
      label={label}
      settingPath={settingPath}
      onValueChange={handleValueChange}
      rightElement={(value) => {
        if (value === CUSTOM_OPTION) {
          return (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={uploadCustomSound}
                className="shrink-0"
                title="Edit custom sound"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={deleteCustomSound}
                className="shrink-0"
                title="Delete custom sound"
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          );
        }

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
      <SelectItem key="custom" value={CUSTOM_OPTION}>
        Custom
      </SelectItem>
    </SelectInput>
  );
};

export default CustomSoundSelect;
