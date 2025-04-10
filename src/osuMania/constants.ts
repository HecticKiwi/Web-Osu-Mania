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
  [blue], // 1K
  [blue, blue], // 2K
  [white, blue, white], // 3K
  [white, blue, blue, white], // 4K
  [white, blue, yellow, blue, white], // 5K
  [blue, white, blue, blue, white, blue], // 6K
  [blue, white, blue, yellow, blue, white, blue], // 7K
  [white, blue, white, blue, blue, white, blue, white], // 8K
  [white, blue, white, blue, yellow, blue, white, blue, white], // 9K
  [white, blue, white, blue, white, white, blue, white, blue, white], // 10K
  [white, blue, white, blue, white, yellow, white, blue, white, blue, white], // 11K
  [
    white,
    blue,
    white,
    blue,
    white,
    blue,
    blue,
    white,
    blue,
    white,
    blue,
    white,
  ], // 12K
  [
    white,
    blue,
    white,
    blue,
    white,
    blue,
    yellow,
    blue,
    white,
    blue,
    white,
    blue,
    white,
  ], // 13K
  [
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
  ], // 14K
  [
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    yellow,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
  ], // 15K
  [
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
  ], // 16K
  [
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    yellow,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
  ], // 17K
  [
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
    blue,
    white,
  ], // 18K
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
