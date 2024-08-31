import { Judgement } from "@/types";

// All coordinates/sizes in osu assume the game is running at 640x480 res, or 854x480 for 16:9 aspect ratio
export const OSU_WIDTH = 854;
export const OSU_HEIGHT = 480;

// The scroll speed calcs aren't documented anywhere so I eyeballed this constant
export const SCROLL_SPEED_MULT = 0.085;

export const SKIN_URL = `${process.env.NEXT_PUBLIC_ASSETS_URL}/skin`;

export const TEXTURES = {
  NOTE: `${SKIN_URL}/note1.png`,
  NOTE2: `${SKIN_URL}/note2.png`,
  NOTES: `${SKIN_URL}/noteS.png`,
  STAGE_HINT: `${SKIN_URL}/mania-stage-hint.png`,
  STAGE_LIGHT: `${SKIN_URL}/mania-stage-light@2x.png`,
  KEY1: `${SKIN_URL}/key-1.png`,
  KEY1P: `${SKIN_URL}/key-1p.png`,
  KEY2P: `${SKIN_URL}/key-2p.png`,
  KEYSP: `${SKIN_URL}/key-sp.png`,
  LN1: `${SKIN_URL}/LN1.png`,
  LN2: `${SKIN_URL}/LN2.png`,
  LNS: `${SKIN_URL}/LNS.png`,
  T1: `${SKIN_URL}/T1.png`,
  T2: `${SKIN_URL}/T2.png`,
  TS: `${SKIN_URL}/TS.png`,
};

export const JUDGEMENT_TEXTURES: { [key in Judgement]: string } = {
  0: `${SKIN_URL}/mania-hit0-0@2x.png`,
  50: `${SKIN_URL}/mania-hit50-0@2x.png`,
  100: `${SKIN_URL}/mania-hit100-0@2x.png`,
  200: `${SKIN_URL}/mania-hit200-0@2x.png`,
  300: `${SKIN_URL}/mania-hit300-0@2x.png`,
  320: `${SKIN_URL}/mania-hit300g-0@2x.png`,
};
