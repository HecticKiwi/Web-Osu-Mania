import { getJudgementUrl } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { Assets } from "pixi.js";
import { BASE_ASSETS_URL, JUDGEMENTS } from "./constants";

export async function loadAssets() {
  await Assets.load(`${BASE_ASSETS_URL}/RobotoMono.ttf`);
  await Assets.load(`${BASE_ASSETS_URL}/VarelaRound.ttf`);

  const judgementSet = useSettingsStore.getState().skin.judgementSet;
  const judgementPromises = JUDGEMENTS.map((judgement) =>
    Assets.load(getJudgementUrl(judgement, judgementSet)),
  );

  await Promise.all([
    ...judgementPromises,
    Assets.load(`${BASE_ASSETS_URL}/skin/arrow.svg`),
    Assets.load(`${BASE_ASSETS_URL}/skin/arrowOutline.svg`),
    Assets.load(`${BASE_ASSETS_URL}/skin/arrowThick.svg`),
    Assets.load(`${BASE_ASSETS_URL}/skin/arrowThickOutline.svg`),
  ]);
}
