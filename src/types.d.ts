import { HitObject } from "./lib/beatmapParser";
import { OldHold } from "./osuMania/sprites/hold";
import { Hold } from "./osuMania/sprites/hold";
import { Tap } from "./osuMania/sprites/tap";

export type GameState = "WAIT" | "PLAY" | "PAUSE";

export type Results = {
  score: number;
  320: number;
  300: number;
  200: number;
  100: number;
  50: number;
  0: number;
  accuracy: number;
  maxCombo: number;
};

export type Column = (Tap | Hold)[];

export type Judgement = 320 | 300 | 200 | 100 | 50 | 0;

export interface HitWindows {
  320: number;
  300: number;
  200: number;
  100: number;
  50: number;
  0: number;
}
