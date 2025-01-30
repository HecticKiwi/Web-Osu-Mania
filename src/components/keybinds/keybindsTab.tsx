"use client";

import { keyCodeToString, setNestedProperty } from "@/lib/utils";
import { produce } from "immer";
import { Fragment, useEffect, useState } from "react";
import {
  defaultSettings,
  useSettingsContext,
} from "../providers/settingsProvider";
import { Button } from "../ui/button";

const KeybindsTab = () => {
  const [keyBindPath, setKeyBindPath] = useState<any | null>(null);
  const { settings, setSettings } = useSettingsContext();

  // Listen for gamepad events
  useEffect(() => {
    let animationFrameId: number;

    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads.find((gp) => gp !== null);

      if (gamepad) {
        const pressedButtonIndex = gamepad.buttons.findIndex(
          (button) => button.pressed,
        );

        if (pressedButtonIndex !== -1) {
          setSettings(
            produce((draft) => {
              setNestedProperty(
                draft,
                keyBindPath,
                `🎮Btn${pressedButtonIndex}`,
              );
            }),
          );
          setKeyBindPath(null);
        }
      }

      animationFrameId = requestAnimationFrame(checkGamepad);
    };

    if (keyBindPath) {
      animationFrameId = requestAnimationFrame(checkGamepad);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [keyBindPath, setSettings]);

  // Listen for keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.stopPropagation();

      if (!keyBindPath) {
        return;
      }

      if (event.code !== "Escape") {
        setSettings(
          produce((draft) => {
            setNestedProperty(draft, keyBindPath, event.code);
          }),
        );
      }
      setKeyBindPath(null);
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [keyBindPath, setSettings]);

  if (!settings) {
    return null;
  }

  return (
    <div>
      <p className="text-muted-foreground">
        Supports keyboard and gamepad inputs. If you're using touch controls,
        you don't need to do anything here - just tap on the lanes (´• ω •`)
      </p>

      {/* <h3 className="mb-2 text-lg font-semibold">General</h3> */}

      {settings.keybinds.keyModes.map((keyMode, i) => (
        <Fragment key={i}>
          <h3 className="mb-2 mt-6 text-lg font-semibold">{i + 1}K</h3>

          <div className="flex flex-col gap-1">
            {keyMode.map((key, j) => (
              <div
                key={`${i + 1}K: ${j}`}
                className="grid grid-cols-2 items-center rounded bg-background/50 p-1"
              >
                <div className="text-sm font-semibold text-muted-foreground">
                  Key {j + 1}
                </div>

                <Button
                  size={"sm"}
                  className="h-8 w-full"
                  onClick={() =>
                    setKeyBindPath(`keybinds.keyModes[${i}][${j}]`)
                  }
                  variant={
                    keyBindPath === `keybinds.keyModes[${i}][${j}]`
                      ? "default"
                      : "secondary"
                  }
                >
                  {keyCodeToString(key)}
                </Button>
              </div>
            ))}
          </div>
        </Fragment>
      ))}

      <Button
        variant={"destructive"}
        size={"sm"}
        onClick={() => {
          setSettings(
            produce((draft) => {
              draft.keybinds = defaultSettings.keybinds;
            }),
          );
        }}
        className="mt-8 w-full"
      >
        Reset Keybinds
      </Button>
    </div>
  );
};

export default KeybindsTab;
