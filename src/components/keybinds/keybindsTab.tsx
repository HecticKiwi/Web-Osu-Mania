import { setNestedProperty } from "@/lib/utils";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { defaultSettings, useSettingsStore } from "../../stores/settingsStore";
import { Button } from "../ui/button";
import KeybindButton from "./keybindButton";

const KeybindsTab = () => {
  const setSettings = useSettingsStore.use.setSettings();
  const keybinds = useSettingsStore.use.keybinds();
  const [selectedKeybindPath, setSelectedKeybindPath] = useState<any | null>(
    null,
  );

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
          setSettings((draft) => {
            setNestedProperty(
              draft,
              selectedKeybindPath,
              `🎮Btn${pressedButtonIndex}`,
            );
          });
          setSelectedKeybindPath(null);
        }
      }

      animationFrameId = requestAnimationFrame(checkGamepad);
    };

    if (selectedKeybindPath) {
      animationFrameId = requestAnimationFrame(checkGamepad);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedKeybindPath, setSettings]);

  // Listen for keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.stopPropagation();

      if (!selectedKeybindPath) {
        return;
      }

      if (event.code !== "Escape") {
        setSettings((draft) => {
          setNestedProperty(draft, selectedKeybindPath, event.code);
        });
      }
      setSelectedKeybindPath(null);
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedKeybindPath, setSettings]);

  return (
    <div>
      <p className="text-muted-foreground text-sm">
        Supports keyboard and gamepad inputs. If you're using touch controls,
        you don't need to do anything here - just tap on the lanes (´• ω •`)
      </p>

      <p className="text-muted-foreground mt-2 text-sm">
        Use right-click to clear a keybind.
      </p>

      <h3 className="mt-6 mb-2 text-lg font-semibold">General</h3>
      <div className="flex flex-col gap-1">
        <div className="bg-background/50 grid grid-cols-2 items-center rounded p-1">
          <div className="text-muted-foreground text-sm font-semibold">
            Pause / resume gameplay
          </div>

          <div className="grid grid-cols-2 gap-1">
            <Button size={"sm"} className="h-8" disabled>
              Escape
            </Button>

            <KeybindButton
              keybind={keybinds.pause}
              keybindPath={"keybinds.pause"}
              selectedKeybindPath={selectedKeybindPath}
              setSelectedKeybindPath={setSelectedKeybindPath}
            />
          </div>
        </div>
        <div className="bg-background/50 grid grid-cols-2 items-center rounded p-1">
          <div className="text-muted-foreground text-sm font-semibold">
            Quick retry (hold)
          </div>

          <KeybindButton
            keybind={keybinds.retry}
            keybindPath={"keybinds.retry"}
            selectedKeybindPath={selectedKeybindPath}
            setSelectedKeybindPath={setSelectedKeybindPath}
          />
        </div>
        <div className="bg-background/50 grid grid-cols-2 items-center rounded p-1">
          <div className="text-muted-foreground text-sm font-semibold">
            Toggle HUD
          </div>

          <KeybindButton
            keybind={keybinds.toggleHud}
            keybindPath={"keybinds.toggleHud"}
            selectedKeybindPath={selectedKeybindPath}
            setSelectedKeybindPath={setSelectedKeybindPath}
          />
        </div>
      </div>

      {keybinds.keyModes.map((keyMode, i) => (
        <Fragment key={i}>
          <h3 className="mt-6 mb-2 text-lg font-semibold">{i + 1}K</h3>

          <div className="flex flex-col gap-1">
            {keyMode.map((key, j) => (
              <div
                key={`${i + 1}K: ${j}`}
                className="bg-background/50 grid grid-cols-2 items-center rounded p-1"
              >
                <div className="text-muted-foreground text-sm font-semibold">
                  Key {j + 1}
                </div>

                <KeybindButton
                  keybind={key}
                  keybindPath={`keybinds.keyModes[${i}][${j}]`}
                  selectedKeybindPath={selectedKeybindPath}
                  setSelectedKeybindPath={setSelectedKeybindPath}
                />
              </div>
            ))}
          </div>
        </Fragment>
      ))}

      <Button
        variant={"destructive"}
        size={"sm"}
        onClick={() => {
          setSettings((draft) => {
            draft.keybinds = defaultSettings.keybinds;
          });
          toast("Keybinds have been reset.");
        }}
        className="mt-8 w-full"
      >
        Reset Keybinds
      </Button>
    </div>
  );
};

export default KeybindsTab;
