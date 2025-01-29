"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { keyCodeToString, setNestedProperty } from "@/lib/utils";
import { produce } from "immer";
import { useEffect, useState } from "react";
import {
  defaultSettings,
  useSettingsContext,
} from "./providers/settingsProvider";
import { Button } from "./ui/button";

const Keybinds = () => {
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

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setKeyBindPath(null);
    }
  };

  return (
    <Dialog onOpenChange={(isOpen) => handleOpenChange(isOpen)}>
      <DialogTrigger asChild>
        <Button className="w-full">Edit Keybinds</Button>
      </DialogTrigger>

      <DialogContent
        aria-describedby={undefined}
        className="w-fit max-w-full gap-0 overflow-x-auto scrollbar"
        onEscapeKeyDown={(e) => {
          if (keyBindPath) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-5">
            <span className="grow border-t border-border "></span>
            <DialogTitle className="text-2xl font-bold text-muted-foreground">
              Keybinds
            </DialogTitle>
            <span className="grow border-t border-border"></span>
          </div>
        </DialogHeader>

        <p className="text-muted-foreground">
          Supports keyboard and gamepad inputs. If you're using touch controls,
          you don't need to do anything here - just tap on the lanes (´• ω •`)
        </p>

        {/* Keys */}
        <div className="w-4xl mt-4 flex flex-col">
          {settings.keybinds.keyModes.map((keyMode, i) => (
            <div
              key={i}
              className="flex items-center py-2 even:bg-secondary/25"
            >
              <div className="w-24 text-center font-semibold">{i + 1}K</div>
              <div className="flex grow justify-center gap-4">
                {keyMode.map((key, j) => (
                  <Button
                    key={`${i + 1}K: ${j}`}
                    size={"sm"}
                    className="w-16"
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
                ))}
              </div>
            </div>
          ))}
        </div>

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
          className="mt-4"
        >
          Reset Keybinds
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Keybinds;
