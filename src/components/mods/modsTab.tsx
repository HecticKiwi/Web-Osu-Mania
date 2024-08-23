"use client";

import { useContext } from "react";
import {
  defaultSettings,
  settingsContext,
} from "../providers/settingsProvider";
import { Switch } from "../ui/switch";
import { produce } from "immer";
import { Button } from "../ui/button";

const ModsTab = () => {
  const { settings, resetSettings, updateSettings, setSettings } =
    useContext(settingsContext);

  if (!settings) {
    return null;
  }

  const resetMods = () => {
    setSettings(
      produce((draft) => {
        draft.mods = defaultSettings.mods;
      }),
    );
  };

  return (
    <>
      <h3 className="mb-1 text-lg font-semibold">Difficulty Reduction</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Easy
          </div>
          <Switch
            checked={settings.mods.easy}
            onCheckedChange={(checked) =>
              setSettings(
                produce((draft) => {
                  draft.mods.easy = checked;

                  if (checked) {
                    draft.mods.hardRock = false;
                  }
                }),
              )
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Half Time
          </div>
          <Switch
            checked={settings.mods.playbackRate === 0.75}
            onCheckedChange={(checked) =>
              setSettings(
                produce((draft) => {
                  if (checked) {
                    draft.mods.playbackRate = 0.75;
                  } else {
                    draft.mods.playbackRate = 1;
                  }
                }),
              )
            }
          />
        </div>
      </div>

      <h3 className="mb-1 mt-4 text-lg font-semibold">Difficulty Increase</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Hard Rock
          </div>
          <Switch
            checked={settings.mods.hardRock}
            onCheckedChange={(checked) =>
              setSettings(
                produce((draft) => {
                  draft.mods.hardRock = checked;

                  if (checked) {
                    draft.mods.easy = false;
                  }
                }),
              )
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Double Time
          </div>
          <Switch
            checked={settings.mods.playbackRate === 1.5}
            onCheckedChange={(checked) =>
              setSettings(
                produce((draft) => {
                  if (checked) {
                    draft.mods.playbackRate = 1.5;
                  } else {
                    draft.mods.playbackRate = 1;
                  }
                }),
              )
            }
          />
        </div>
      </div>

      <h3 className="mb-1 mt-4 text-lg font-semibold">Special</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Autoplay
          </div>
          <Switch
            checked={settings.mods.autoplay}
            onCheckedChange={(checked) =>
              setSettings(
                produce((draft) => {
                  draft.mods.autoplay = checked;
                }),
              )
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Mirror
          </div>
          <Switch
            checked={settings.mods.mirror}
            onCheckedChange={(checked) =>
              setSettings(
                produce((draft) => {
                  draft.mods.mirror = checked;
                }),
              )
            }
          />
        </div>
      </div>

      <Button
        variant={"destructive"}
        className="mt-8 w-full"
        onClick={() => resetMods()}
      >
        Reset Mods
      </Button>
    </>
  );
};

export default ModsTab;
