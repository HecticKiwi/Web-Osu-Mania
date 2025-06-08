"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useState } from "react";
import { HslStringColorPicker } from "react-colorful";
import { toast } from "sonner";
import {
  defaultSettings,
  SKIN_STYLE_ICONS,
  SKIN_STYLES,
  SkinStyle,
  useSettingsStore,
} from "../../stores/settingsStore";
import { keys } from "../filters/keysFilter";
import RadioGroupInput from "../inputs/radioGroupInput";
import SliderInput from "../inputs/sliderInput";
import SwitchInput from "../inputs/switchInput";
import { Input } from "../ui/input";

const SkinSettings = () => {
  const setSettings = useSettingsStore.use.setSettings();
  const [keyCount, setKeyCount] = useState("4");

  const colors = useSettingsStore((s) => s.skin.colors.custom)[
    Number(keyCount) - 1
  ];
  const colorMode = useSettingsStore((s) => s.skin.colors.mode);

  return (
    <>
      <h3 className="mb-2 mt-6 text-lg font-semibold">Skin</h3>
      <div className="space-y-4">
        <RadioGroupInput
          label="Style"
          selector={(state) => state.style}
          onValueChange={(value: string) =>
            setSettings((draft) => {
              draft.style = value as SkinStyle;
            })
          }
          className="space-y-2"
        >
          {SKIN_STYLES.map((style) => (
            <Label
              key={style}
              htmlFor={style}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem value={style} id={style} />
              <span className="flex gap-2">
                <span className="w-4 text-center">
                  {SKIN_STYLE_ICONS[style]}
                </span>
                {capitalizeFirstLetter(style)}
              </span>
            </Label>
          ))}
        </RadioGroupInput>

        <Tabs
          value={colorMode}
          onValueChange={(value) =>
            setSettings((mode) => {
              mode.skin.colors.mode = value as "simple" | "custom";
            })
          }
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="simple" className="mt-4 space-y-4">
            <SliderInput
              label="Primary Color"
              selector={(state) => state.skin.colors.simple.hue}
              graphic={(hue) => (
                <div
                  className="size-6 shrink-0 rounded-full"
                  style={{ backgroundColor: `hsl(${hue}, 80%, 69%)` }}
                ></div>
              )}
              tooltip={(hue) => hue}
              onValueChange={([hue]) =>
                setSettings((draft) => {
                  draft.skin.colors.simple.hue = hue;
                })
              }
              min={0}
              max={360}
              step={1}
            />
            <SwitchInput
              label="Darker Hold Notes"
              selector={(state) => state.darkerHoldNotes}
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.darkerHoldNotes = checked;
                })
              }
            />
          </TabsContent>
          <TabsContent value={"custom"} className="space-y-4">
            <div className="grid grid-cols-2 items-center">
              <div className="pr-2 text-sm font-semibold text-muted-foreground">
                Mode
              </div>

              <Select value={keyCount} onValueChange={setKeyCount}>
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {keys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}K
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4 overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="w-16 px-2 py-2 text-left font-normal">
                      Column
                    </th>
                    <th className="px-2 py-2 text-left font-normal">
                      Note Color
                    </th>
                    <th className="px-2 py-2 text-left font-normal">
                      Hold Color
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {colors.map((colorSet, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-2 py-2 text-center">{i + 1}</td>
                      <td className="px-2 py-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-7 w-full border p-0"
                              style={{ backgroundColor: colorSet.tap }}
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-fit">
                            <HslStringColorPicker
                              color={colors[i].tap}
                              onChange={(color) =>
                                setSettings((draft) => {
                                  draft.skin.colors.custom[
                                    Number(keyCount) - 1
                                  ][i].tap = color;
                                })
                              }
                            />
                            <Input
                              className="mt-4"
                              value={colors[i].tap}
                              onChange={(e) => {
                                const newColor = e.target.value;
                                if (newColor.startsWith("hsl")) {
                                  setSettings((draft) => {
                                    draft.skin.colors.custom[
                                      Number(keyCount) - 1
                                    ][i].tap = newColor;
                                  });
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="px-2 py-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-7 w-full border p-0"
                              style={{ backgroundColor: colorSet.hold }}
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-fit">
                            <HslStringColorPicker
                              color={colors[i].hold}
                              onChange={(color) =>
                                setSettings((draft) => {
                                  draft.skin.colors.custom[
                                    Number(keyCount) - 1
                                  ][i].hold = color;
                                })
                              }
                            />
                            <Input
                              className="mt-4"
                              value={colors[i].hold}
                              onChange={(e) => {
                                const newColor = e.target.value;
                                if (newColor.startsWith("hsl")) {
                                  setSettings((draft) => {
                                    draft.skin.colors.custom[
                                      Number(keyCount) - 1
                                    ][i].hold = newColor;
                                  });
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              className="mt-4 w-full"
              variant={"destructive"}
              size={"sm"}
              onClick={() => {
                setSettings((draft) => {
                  draft.skin.colors.custom[Number(keyCount) - 1] =
                    defaultSettings.skin.colors.custom[Number(keyCount) - 1];
                });

                toast("Colors have been reset.");
              }}
            >
              Reset Colors
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SkinSettings;
