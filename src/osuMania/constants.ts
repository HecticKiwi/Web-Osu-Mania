// All coordinates/sizes in osu assume the game is running at 640x480 res, or 854x480 for 16:9 aspect ratio
export const OSU_WIDTH = 854;
export const OSU_HEIGHT = 480;

// This value is gathered from here:
// https://github.com/ppy/osu/blob/f0e2b803ded7a3f7a826c05a0138bcc923dde9a9/osu.Game.Rulesets.Mania/UI/DrawableManiaRuleset.cs#L46
export const MAX_TIME_RANGE = 11485;

const blue = "hsl(212, 80%, 69%)";
const white = "hsl(212, 8%, 98.45%)";
const yellow = "hsl(62, 80%, 69%)";

export const laneColors = [
  [blue],
  [blue, blue],
  [white, blue, white],
  [white, blue, blue, white],
  [white, blue, yellow, blue, white],
  [blue, white, blue, blue, white, blue],
  [blue, white, blue, yellow, blue, white, blue],
  [white, blue, white, blue, blue, white, blue, white],
  [white, blue, white, blue, yellow, blue, white, blue, white],
  [white, blue, white, blue, white, white, blue, white, blue, white],
] as const;

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
  [down],
  [left, right],
  [left, down, right],
  [left, down, up, right],
  [left, upLeft, down, upRight, right],
  [left, upRight, down, up, upRight, right],
  [left, upLeft, up, down, up, upRight, right],
  [left, upLeft, downLeft, down, up, downRight, upRight, right],
  [left, upLeft, downLeft, up, down, up, downRight, upRight, right],
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
  ],
] as const;

export const circleColumnRatio = 0.8;
export const arrowColumnRatio = 0.8;
export const diamondColumnRatio = 0.85;

export const laneWidths = [56, 56, 56, 56, 50, 47, 42, 40, 38, 35] as const;

export const UNPAUSE_DELAY = 1500;
