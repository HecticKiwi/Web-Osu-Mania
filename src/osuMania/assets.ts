import { getJudgementUrl } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { Assets } from "pixi.js";
import { BASE_ASSETS_URL, JUDGEMENTS } from "./constants";

export async function loadAssets() {
  const promises: Promise<void>[] = [
    Assets.load(`${BASE_ASSETS_URL}/RobotoMono.ttf`),
    Assets.load(`${BASE_ASSETS_URL}/VarelaRound.ttf`),
  ];

  const judgementSet = useSettingsStore.getState().skin.judgementSet;
  promises.push(
    ...JUDGEMENTS.map((judgement) =>
      Assets.load(getJudgementUrl(judgement, judgementSet)),
    ),
  );

  await promises;
}
