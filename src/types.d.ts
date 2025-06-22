import { HitError } from "./components/game/timingDistributionChart";
import { JUDGEMENTS } from "./osuMania/constants";
import { Hold } from "./osuMania/sprites/hold/hold";
import { Tap } from "./osuMania/sprites/tap/tap";
import { ReplayData } from "./osuMania/systems/replayRecorder";

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
  viewingReplay?: boolean;
  replayData?: ReplayData;
  hitErrors: HitError[];
};

export type Column = (Tap | Hold)[];

export type Judgement = (typeof JUDGEMENTS)[number];

declare global {
  interface Window {
    __PIXI_APP__: Application;
  }
}
