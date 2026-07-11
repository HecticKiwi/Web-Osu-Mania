import { keys } from "@/components/filters/keysFilter";
import RadioGroupInput from "@/components/inputs/radioGroupInput";
import SliderInput from "@/components/inputs/sliderInput";
import SwitchInput from "@/components/inputs/switchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { isValidHsl } from "@/lib/utils";
import type { SkinStyle } from "@/stores/settingsStore";
import {
  defaultSettings,
  skinStyleOptions,
  useSettingsStore,
} from "@/stores/settingsStore";
import { useState } from "react";
import { HslStringColorPicker } from "react-colorful";
import { toast } from "sonner";
import FilterableList from "../filterableList";
import JudgementSet, {
  judgementSetLabel,
  judgementSetOptionLabels,
} from "./judgementSet";

const SkinSettings = ({ searchQuery }: { searchQuery?: string }) => {
  const setSettings = useSettingsStore.use.setSettings();
  const [keyCount, setKeyCount] = useState("4");

  const colors = useSettingsStore((s) => s.skin.colors.custom)[
    Number(keyCount) - 1
  ];
  const colorMode = useSettingsStore((s) => s.skin.colors.mode);

  return (
    <FilterableList
      title="Skin"
      items={[
        {
          label: judgementSetLabel,
          searchTags: judgementSetOptionLabels,
          render: () => <JudgementSet />,
        },
        {
          label: "Note Style",
          searchTags: skinStyleOptions.map((option) => option.label),
          render: ({ label }) => (
            <RadioGroupInput
              label={label}
              settingPath="style"
              onValueChange={(value: string) =>
                setSettings((draft) => {
                  draft.style = value as SkinStyle;
                })
              }
              className="space-y-2"
            >
              {skinStyleOptions.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={option.id}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <span className="flex gap-2">
                    <span className="w-4 text-center">{option.icon}</span>
                    {option.label}
                  </span>
                </Label>
              ))}
            </RadioGroupInput>
          ),
        },
        {
          label: "Color",
          searchTags: [
            "Simple",
            "Custom",
            "Primary Color",
            "Darker Hold Notes",
            "Tap",
            "Hold Head",
            "Hold Body",
            "Reset Colors",
          ],
          render: () => (
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
                  label={"Primary Color"}
                  settingPath="skin.colors.simple.hue"
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
                  settingPath="darkerHoldNotes"
                  onCheckedChange={(checked) =>
                    setSettings((draft) => {
                      draft.darkerHoldNotes = checked;
                    })
                  }
                />
              </TabsContent>
              <TabsContent value={"custom"} className="space-y-4">
                <div className="grid grid-cols-2 items-center">
                  <div className="text-muted-foreground pr-2 text-sm font-semibold">
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
                        <th className="w-16 px-2 py-2 text-center font-normal">
                          Column
                        </th>
                        <th className="w-125 px-2 py-2 text-center font-normal">
                          Tap
                        </th>
                        <th className="w-125 px-2 py-2 text-center font-normal">
                          Hold Head
                        </th>
                        <th className="w-125 px-2 py-2 text-center font-normal">
                          Hold Body
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {colors.map((colorSet, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-2 py-2 text-center">{i + 1}</td>
                          <td className="px-2 py-2">
                            <Popover>
                              <PopoverTrigger
                                asChild
                                className="block h-7 w-full border p-0"
                              >
                                <Button
                                  variant="outline"
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
                                {!isValidHsl(colors[i].tap) && (
                                  <p className="mt-1 w-50 text-sm text-red-400">
                                    Invalid color; white will be used as a
                                    fallback.
                                  </p>
                                )}
                              </PopoverContent>
                            </Popover>
                          </td>
                          <td className="px-2 py-2">
                            <Popover>
                              <PopoverTrigger
                                asChild
                                className="block h-7 w-full border p-0"
                              >
                                <Button
                                  variant="outline"
                                  style={{
                                    backgroundColor: colorSet.holdHead,
                                  }}
                                />
                              </PopoverTrigger>
                              <PopoverContent className="w-fit">
                                <HslStringColorPicker
                                  color={colors[i].holdHead}
                                  onChange={(color) =>
                                    setSettings((draft) => {
                                      draft.skin.colors.custom[
                                        Number(keyCount) - 1
                                      ][i].holdHead = color;
                                    })
                                  }
                                />
                                <Input
                                  className="mt-4"
                                  value={colors[i].holdHead}
                                  onChange={(e) => {
                                    const newColor = e.target.value;
                                    if (newColor.startsWith("hsl")) {
                                      setSettings((draft) => {
                                        draft.skin.colors.custom[
                                          Number(keyCount) - 1
                                        ][i].holdHead = newColor;
                                      });
                                    }
                                  }}
                                />
                                {!isValidHsl(colors[i].holdHead) && (
                                  <p className="mt-1 w-50 text-sm text-red-400">
                                    Invalid color; white will be used as a
                                    fallback.
                                  </p>
                                )}
                              </PopoverContent>
                            </Popover>
                          </td>
                          <td className="px-2 py-2">
                            <Popover>
                              <PopoverTrigger
                                asChild
                                className="block h-7 w-full border p-0"
                              >
                                <Button
                                  variant="outline"
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
                                {!isValidHsl(colors[i].hold) && (
                                  <p className="mt-1 w-50 text-sm text-red-400">
                                    Invalid color; white will be used as a
                                    fallback.
                                  </p>
                                )}
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
                        defaultSettings.skin.colors.custom[
                          Number(keyCount) - 1
                        ];
                    });

                    toast("Colors have been reset.");
                  }}
                >
                  Reset Colors
                </Button>
              </TabsContent>
            </Tabs>
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default SkinSettings;
