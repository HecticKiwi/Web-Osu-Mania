import { ColumnColor } from "@/stores/settingsStore";

export const JUDGEMENTS = [320, 300, 200, 100, 50, 0] as const;

// All coordinates/sizes in osu assume the game is running at 640x480 res, or 854x480 for 16:9 aspect ratio
export const OSU_WIDTH = 854;
export const OSU_HEIGHT = 480;

// This value is gathered from here:
// https://github.com/ppy/osu/blob/f0e2b803ded7a3f7a826c05a0138bcc923dde9a9/osu.Game.Rulesets.Mania/UI/DrawableManiaRuleset.cs#L46
export const MAX_TIME_RANGE = 11485;

export function getAllLaneColors(
  hue: number,
  darkerHoldNotes?: boolean,
): ColumnColor[][] {
  const primary = `hsl(${hue}, 80%, 69%)`;
  const primaryDark = `hsl(${hue}, 36%, 69%)`;

  const secondary = `hsl(${hue}, 8%, 98.45%)`;
  const secondaryDark = `hsl(${hue}, 0%, 59%)`;

  const centerHue = hue > 35 && hue < 75 ? 212 : 62;
  const center = `hsl(${centerHue}, 80%, 69%)`;
  const centerDark = `hsl(${centerHue}, 36%, 41%)`;

  function makeColorObject(color: string): {
    tap: string;
    hold: string;
  } {
    let holdColor = color;
    if (darkerHoldNotes) {
      if (color === primary) {
        holdColor = primaryDark;
      } else if (color === secondary) {
        holdColor = secondaryDark;
      } else if (color === center) {
        holdColor = centerDark;
      }
    }

    return {
      tap: color,
      hold: holdColor,
    };
  }

  const rawLaneColors = [
    [primary], // 1K
    [primary, primary], // 2K
    [secondary, primary, secondary], // 3K
    [secondary, primary, primary, secondary], // 4K
    [secondary, primary, center, primary, secondary], // 5K
    [primary, secondary, primary, primary, secondary, primary], // 6K
    [primary, secondary, primary, center, primary, secondary, primary], // 7K
    [
      secondary,
      primary,
      secondary,
      primary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 8K
    [
      secondary,
      primary,
      secondary,
      primary,
      center,
      primary,
      secondary,
      primary,
      secondary,
    ], // 9K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 10K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      center,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 11K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 12K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      center,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 13K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 14K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      center,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 15K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 16K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      center,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 17K
    [
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
      primary,
      secondary,
    ], // 18K
  ];

  const laneColors = rawLaneColors.map((row) =>
    row.map((color) => makeColorObject(color)),
  );

  return laneColors;
}

// Angles assume arrow is pointing up by default
const up = 0;
const upRight = 45;
const right = 90;
const downRight = 135;
const down = 180;
const downLeft = 225;
const left = 270;
const upLeft = 315;

export const laneArrowDirections = [
  [down], // 1K
  [left, right], // 2K
  [left, down, right], // 3K
  [left, down, up, right], // 4K
  [left, upLeft, down, upRight, right], // 5K
  [left, upRight, down, up, upRight, right], // 6K
  [left, upLeft, up, down, up, upRight, right], // 7K
  [left, upLeft, downLeft, down, up, downRight, upRight, right], // 8K
  [left, upLeft, downLeft, up, down, up, downRight, upRight, right], // 9K
  [
    left,
    upLeft,
    downLeft,
    upLeft,
    down,
    up,
    upRight,
    downRight,
    upRight,
    right,
  ], // 10K
  [
    left,
    upLeft,
    downLeft,
    upLeft,
    down,
    up,
    down,
    upRight,
    downRight,
    upRight,
    right,
  ], // 11K
  [
    left,
    upRight,
    down,
    up,
    upRight,
    right,
    left,
    upRight,
    down,
    up,
    upRight,
    right,
  ], // 12K
  [
    left,
    upLeft,
    downLeft,
    upLeft,
    downLeft,
    down,
    up,
    down,
    downRight,
    upRight,
    downRight,
    upRight,
    right,
  ], // 13K
  [
    left,
    upLeft,
    up,
    down,
    up,
    upRight,
    right,
    left,
    upLeft,
    up,
    down,
    up,
    upRight,
    right,
  ], // 14K
  [
    left,
    upLeft,
    downLeft,
    left,
    upLeft,
    downLeft,
    down,
    up,
    down,
    downRight,
    upRight,
    right,
    downRight,
    upRight,
    right,
  ], // 15K
  [
    left,
    upLeft,
    downLeft,
    down,
    up,
    downRight,
    upRight,
    right,
    left,
    upLeft,
    downLeft,
    down,
    up,
    downRight,
    upRight,
    right,
  ], // 16K
  [
    left,
    upLeft,
    downLeft,
    left,
    upLeft,
    downLeft,
    left,
    down,
    up,
    down,
    right,
    downRight,
    upRight,
    right,
    downRight,
    upRight,
    right,
  ], // 17K
  [
    left,
    upLeft,
    downLeft,
    up,
    down,
    up,
    downRight,
    upRight,
    right,
    left,
    upLeft,
    downLeft,
    up,
    down,
    up,
    downRight,
    upRight,
    right,
  ], // 18K
] as const;

export const circleColumnRatio = 0.8;
export const arrowColumnRatio = 0.8;
export const diamondColumnRatio = 0.85;

export const laneWidths = [
  56, 56, 56, 56, 50, 47, 42, 40, 38, 35, 31, 30, 29, 27, 24, 22, 21, 20,
] as const;
