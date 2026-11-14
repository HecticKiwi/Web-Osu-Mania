import { Input } from "@/components/ui/input";
import { isValidHsl } from "@/lib/utils";
import type { ColumnColor } from "@/stores/settingsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { HslStringColorPicker } from "react-colorful";

const ColorInput = ({
  keyCount,
  columnIndex,
  colorKey,
}: {
  keyCount: number;
  columnIndex: number;
  colorKey: keyof ColumnColor;
}) => {
  const setSettings = useSettingsStore.use.setSettings();
  const colors = useSettingsStore((s) => s.skin.colors.custom)[keyCount - 1];

  return (
    <>
      <HslStringColorPicker
        color={colors[columnIndex][colorKey]}
        onChange={(color) => {
          console.log(color);
          setSettings((draft) => {
            draft.skin.colors.custom[keyCount - 1][columnIndex][colorKey] =
              color;
          });
        }}
      />
      <Input
        className="mt-4"
        value={colors[columnIndex][colorKey]}
        onChange={(e) => {
          const newColor = e.target.value;
          if (newColor.startsWith("hsl")) {
            setSettings((draft) => {
              draft.skin.colors.custom[keyCount - 1][columnIndex][colorKey] =
                newColor;
            });
          }
        }}
      />
      {!isValidHsl(colors[columnIndex][colorKey]) && (
        <p className="mt-1 w-50 text-sm text-red-400">
          Invalid color; white will be used as a fallback.
        </p>
      )}
    </>
  );
};

export default ColorInput;
