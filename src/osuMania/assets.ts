import { BASE_PATH, getJudgementUrl } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { Assets } from "pixi.js";
import { JUDGEMENTS } from "./constants";

export async function loadAssets() {
  await Assets.load(`${BASE_PATH}/RobotoMono.ttf`);
  await Assets.load(`${BASE_PATH}/VarelaRound.ttf`);

  const judgementSet = useSettingsStore.getState().skin.judgementSet;
  const judgementPromises = JUDGEMENTS.map((judgement) =>
    Assets.load(getJudgementUrl(judgement, judgementSet)),
  );

  await Promise.all([
    ...judgementPromises,
    Assets.load(`${BASE_PATH}/skin/arrow.svg`),
    Assets.load(`${BASE_PATH}/skin/arrowOutline.svg`),
  ]);
}
