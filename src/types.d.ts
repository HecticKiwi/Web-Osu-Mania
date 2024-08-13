import { HitObject } from "./osuMania/sprites/hitObject";

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

export type HitObjectData = [
  x: number,
  y: number,
  time: number,
  type: number,
  hitsound: number,
  objectParams: string,
  hitSample: string,
];

export type Column = HitObject[];

export type Judgement = 320 | 300 | 200 | 100 | 50 | 0;

export interface HitWindows {
  320: number;
  300: number;
  200: number;
  100: number;
  50: number;
  0: number;
}

export type BeatmapConfig = {
  columnCount: number;
  columnKeys: string[];
  od: number;
};
