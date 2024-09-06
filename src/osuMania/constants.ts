// All coordinates/sizes in osu assume the game is running at 640x480 res, or 854x480 for 16:9 aspect ratio
export const OSU_WIDTH = 854;
export const OSU_HEIGHT = 480;

// The scroll speed calcs aren't documented anywhere so I eyeballed this constant
export const SCROLL_SPEED_MULT = 0.085;

export const SKIN_URL = `${process.env.NEXT_PUBLIC_ASSETS_URL}/skin`;

const colorNames = ["blue", "white", "yellow", "muted"] as const;
export type Color = (typeof colorNames)[number];

export const colors = {
  blue: "hsl(212, 80%, 69%)",
  white: "hsl(212, 8%, 98.45%)",
  yellow: "hsl(62, 80%, 69%)",
  muted: "hsl(212, 40%, 20.7%)",
};

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
];

export const laneWidths = [56, 56, 56, 56, 50, 47, 42, 40, 38, 35];
