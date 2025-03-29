import { Hold } from "./osuMania/sprites/hold/hold";
import { Tap } from "./osuMania/sprites/tap/tap";
import { Settings } from "@/components/providers/settingsProvider";
import { BeatmapData, Metadata, Difficulty, HitObject, HitWindows, TimingPoint, } from "@/lib/beatmapParser";


export type GameState = "WAIT" | "PLAY" | "PAUSE" | "UNPAUSE" | "FAIL";

export type Results = {
  score: number;
  accuracy: number;
  maxCombo: number;
  320: number;
  300: number;
  200: number;
  100: number;
  50: number;
  0: number;
};

export type PlayResults = Results & {
  failed?: boolean;
  replay?: boolean;
};

export type Column = (Tap | Hold)[];

export type Judgement = 320 | 300 | 200 | 100 | 50 | 0;

declare global {
  interface Window {
    __PIXI_APP__: Application;
  }
}
