"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "sonner";
import SliderInput from "../inputs/sliderInput";
import SwitchInput from "../inputs/switchInput";
import { Button } from "../ui/button";
import ScoreMultiplier from "./scoreMultiplier";

const ModsTab = () => {
  const setSettings = useSettingsStore.use.setSettings();
  const resetMods = useSettingsStore.use.resetMods();
  const hpOverride = useSettingsStore((state) => state.mods.hpOverride);
  const odOverride = useSettingsStore((state) => state.mods.odOverride);
  const cover = useSettingsStore((state) => state.mods.cover);

  return (
    <>
      <ScoreMultiplier />

      <h3 className="mb-2 text-lg font-semibold">Difficulty Reduction</h3>
      <div className="space-y-4">
        <SwitchInput
          label="Easy"
          tooltip="Larger timing windows."
          selector={(state) => state.mods.easy}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.easy = checked;

              if (checked) {
                draft.mods.hardRock = false;
                draft.mods.hpOverride = null;
                draft.mods.odOverride = null;
              }
            })
          }
        />
        <SwitchInput
          label="No Fail"
          tooltip="You can't fail, no matter what."
          selector={(state) => state.mods.noFail}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.noFail = checked;

              if (checked) {
                draft.mods.suddenDeath = false;
              }
            })
          }
        />
        <SwitchInput
          label="Half Time"
          tooltip="0.75x speed (don't ask me why it's called half time)."
          selector={(state) => state.mods.playbackRate === 0.75}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              if (checked) {
                draft.mods.playbackRate = 0.75;
              } else {
                draft.mods.playbackRate = 1;
              }
            })
          }
        />
      </div>

      <h3 className="mb-2 mt-6 text-lg font-semibold">Difficulty Increase</h3>
      <div className="space-y-4">
        <SwitchInput
          label="Hard Rock"
          tooltip="Smaller timing windows."
          selector={(state) => state.mods.hardRock}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.hardRock = checked;

              if (checked) {
                draft.mods.easy = false;
                draft.mods.hpOverride = null;
                draft.mods.odOverride = null;
              }
            })
          }
        />
        <SwitchInput
          label="Sudden Death"
          tooltip="Miss a note and fail."
          selector={(state) => state.mods.suddenDeath}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.suddenDeath = checked;

              if (checked) {
                draft.mods.noFail = false;
              }
            })
          }
        />
        <SwitchInput
          label="Double Time"
          tooltip="1.5x speed (don't ask me why it's called double time)."
          selector={(state) => state.mods.playbackRate === 1.5}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              if (checked) {
                draft.mods.playbackRate = 1.5;
              } else {
                draft.mods.playbackRate = 1;
              }
            })
          }
        />
      </div>

      <h3 className="mb-2 mt-6 text-lg font-semibold">Special</h3>
      <div className="space-y-4">
        <SwitchInput
          label="Autoplay"
          tooltip="Watch a perfect automated play."
          selector={(state) => state.mods.autoplay}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.autoplay = checked;
            })
          }
        />
      </div>

      <h3 className="mb-2 mt-6 text-lg font-semibold">Conversion</h3>
      <div className="space-y-4">
        <SwitchInput
          label="Random"
          tooltip="Shuffle around the notes."
          selector={(state) => state.mods.random}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.random = checked;

              if (checked) {
                draft.mods.mirror = false;
              }
            })
          }
        />
        <SwitchInput
          label="Mirror"
          tooltip="Notes are flipped horizontally."
          selector={(state) => state.mods.mirror}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.mirror = checked;

              if (checked) {
                draft.mods.random = false;
              }
            })
          }
        />
        <SwitchInput
          label="Constant Speed"
          tooltip="No more scroll speed changes during a song."
          selector={(state) => state.mods.constantSpeed}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.constantSpeed = checked;
            })
          }
        />
        <SwitchInput
          label="Hold Off"
          tooltip="All hold notes become normal notes."
          selector={(state) => state.mods.holdOff}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.mods.holdOff = checked;
            })
          }
        />
      </div>

      <h3 className="mb-2 mt-6 text-lg font-semibold">Custom</h3>
      <div className="space-y-4">
        <SliderInput
          label="Song Speed"
          selector={(state) => state.mods.playbackRate}
          tooltip={(playbackRate) => `${playbackRate}x`}
          onValueChange={([playbackRate]) =>
            setSettings((draft) => {
              draft.mods.playbackRate = playbackRate;
            })
          }
          min={0.5}
          max={2}
          step={0.05}
        />
        <SwitchInput
          label="Accuracy Override"
          selector={(state) => state.mods.odOverride !== null}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              if (checked) {
                draft.mods.odOverride = 5;

                draft.mods.easy = false;
                draft.mods.hardRock = false;
              } else {
                draft.mods.odOverride = null;
              }
            })
          }
          extraInput={
            odOverride !== null ? (
              <SliderInput
                containerClassName="w-full"
                selector={(state) => state.mods.odOverride!}
                tooltip={(odOverride) => odOverride}
                onValueChange={([odOverride]) =>
                  setSettings((draft) => {
                    draft.mods.odOverride = odOverride;
                  })
                }
                min={0}
                max={11}
                step={0.5}
              />
            ) : undefined
          }
        />
        <SwitchInput
          label="HP Drain Override"
          selector={(state) => state.mods.hpOverride !== null}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              if (checked) {
                draft.mods.hpOverride = 5;

                draft.mods.easy = false;
                draft.mods.hardRock = false;
              } else {
                draft.mods.hpOverride = null;
              }
            })
          }
          extraInput={
            hpOverride !== null ? (
              <SliderInput
                containerClassName="w-full"
                selector={(state) => state.mods.hpOverride!}
                tooltip={(hpOverride) => hpOverride}
                onValueChange={([hpOverride]) =>
                  setSettings((draft) => {
                    draft.mods.hpOverride = hpOverride;
                  })
                }
                min={0}
                max={11}
                step={0.5}
              />
            ) : null
          }
        />

        <SwitchInput
          label="Fade In"
          selector={(state) => state.mods.cover?.type === "fadeIn"}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              if (checked) {
                draft.mods.cover = {
                  type: "fadeIn",
                  amount: 0.5,
                };
              } else {
                draft.mods.cover = null;
              }
            })
          }
          extraInput={
            cover?.type === "fadeIn" ? (
              <SliderInput
                containerClassName="w-full"
                selector={(state) => state.mods.cover!.amount}
                tooltip={(amount) => `${Math.round(amount * 100)}%`}
                onValueChange={([amount]) =>
                  setSettings((draft) => {
                    draft.mods.cover!.amount = amount;
                  })
                }
                min={0.1}
                max={0.9}
                step={0.01}
              />
            ) : null
          }
        />

        <SwitchInput
          label="Fade Out"
          selector={(state) => state.mods.cover?.type === "fadeOut"}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              if (checked) {
                draft.mods.cover = {
                  type: "fadeOut",
                  amount: 0.5,
                };
              } else {
                draft.mods.cover = null;
              }
            })
          }
          extraInput={
            cover?.type === "fadeOut" ? (
              <SliderInput
                containerClassName="w-full"
                selector={(state) => state.mods.cover!.amount}
                tooltip={(amount) => `${Math.round(amount * 100)}%`}
                onValueChange={([amount]) =>
                  setSettings((draft) => {
                    draft.mods.cover!.amount = amount;
                  })
                }
                min={0.1}
                max={0.9}
                step={0.01}
              />
            ) : null
          }
        />
      </div>

      <Button
        variant={"destructive"}
        className="mt-8 w-full"
        onClick={() => {
          resetMods();
          toast("Mods have been reset.");
        }}
      >
        Reset Mods
      </Button>
    </>
  );
};

export default ModsTab;
