import { BASE_PATH } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { Assets } from "pixi.js";

export async function loadAssets() {
  await Assets.load(`${BASE_PATH}/RobotoMono.ttf`);
  await Assets.load(`${BASE_PATH}/VarelaRound.ttf`);

  const judgementSet = useSettingsStore.getState().skin.judgementSet;
  console.log(judgementSet);

  await Promise.all([
    await Assets.load(
      `${BASE_PATH}/skin/judgementSet${judgementSet}/mania-hit0.png`,
    ),
    await Assets.load(
      `${BASE_PATH}/skin/judgementSet${judgementSet}/mania-hit50.png`,
    ),
    await Assets.load(
      `${BASE_PATH}/skin/judgementSet${judgementSet}/mania-hit100.png`,
    ),
    await Assets.load(
      `${BASE_PATH}/skin/judgementSet${judgementSet}/mania-hit200.png`,
    ),
    await Assets.load(
      `${BASE_PATH}/skin/judgementSet${judgementSet}/mania-hit300.png`,
    ),
    await Assets.load(
      `${BASE_PATH}/skin/judgementSet${judgementSet}/mania-hit300g.png`,
    ),
    await Assets.load(`${BASE_PATH}/skin/arrow.svg`),
    await Assets.load(`${BASE_PATH}/skin/arrowOutline.svg`),
  ]);
}
