// All coordinates/sizes in osu assume the game is running at 640x480 res, or 854x480 for 16:9 aspect ratio
export const OSU_WIDTH = 854;
export const OSU_HEIGHT = 480;

// This value is gathered from here:
// https://github.com/ppy/osu/blob/f0e2b803ded7a3f7a826c05a0138bcc923dde9a9/osu.Game.Rulesets.Mania/UI/DrawableManiaRuleset.cs#L46
export const MAX_TIME_RANGE = 11485;

const colorNames = ["blue", "white", "yellow", "muted"] as const;
export type Color = (typeof colorNames)[number];

export const colors = {
  blue: "hsl(212, 80%, 69%)",
  white: "hsl(212, 8%, 98.45%)",
  yellow: "hsl(62, 80%, 69%)",
  muted: "hsl(212, 40%, 20.7%)",
} as const;

export const laneColors: Color[][] = [
  ["blue"],
  ["blue", "blue"],
  ["white", "blue", "white"],
  ["white", "blue", "blue", "white"],
  ["white", "blue", "yellow", "blue", "white"],
  ["blue", "white", "blue", "blue", "white", "blue"],
  ["blue", "white", "blue", "yellow", "blue", "white", "blue"],
  ["white", "blue", "white", "blue", "blue", "white", "blue", "white"],
  [
    "white",
    "blue",
    "white",
    "blue",
    "yellow",
    "blue",
    "white",
    "blue",
    "white",
  ],
  [
    "white",
    "blue",
    "white",
    "blue",
    "white",
    "white",
    "blue",
    "white",
    "blue",
    "white",
  ],
] as const;

export const laneWidths = [56, 56, 56, 56, 50, 47, 42, 40, 38, 35] as const;
