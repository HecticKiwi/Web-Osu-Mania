import { BASE_PATH } from "@/lib/utils";
import { Assets } from "pixi.js";

export async function loadAssets() {
  await Assets.load(`${BASE_PATH}/RobotoMono.ttf`);
  await Assets.load(`${BASE_PATH}/VarelaRound.ttf`);

  await Promise.all([
    await Assets.load(`${BASE_PATH}/skin/mania-hit0-0.png`),
    await Assets.load(`${BASE_PATH}/skin/mania-hit50-0.png`),
    await Assets.load(`${BASE_PATH}/skin/mania-hit100-0.png`),
    await Assets.load(`${BASE_PATH}/skin/mania-hit200-0.png`),
    await Assets.load(`${BASE_PATH}/skin/mania-hit300-0.png`),
    await Assets.load(`${BASE_PATH}/skin/mania-hit300g-0.png`),
    await Assets.load(`${BASE_PATH}/skin/arrow.svg`),
    await Assets.load(`${BASE_PATH}/skin/arrowOutline.svg`),
  ]);
}
