import { Assets } from "pixi.js";
import { SKIN_URL } from "./constants";

export async function loadAssets() {
  const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL!;

  await Assets.load(`${assetsUrl}/RobotoMono.ttf`);
  await Assets.load(`${assetsUrl}/VarelaRound.ttf`);

  await Promise.all([
    await Assets.load(`${SKIN_URL}/mania-hit0-0.png`),
    await Assets.load(`${SKIN_URL}/mania-hit50-0.png`),
    await Assets.load(`${SKIN_URL}/mania-hit100-0.png`),
    await Assets.load(`${SKIN_URL}/mania-hit200-0.png`),
    await Assets.load(`${SKIN_URL}/mania-hit300-0.png`),
    await Assets.load(`${SKIN_URL}/mania-hit300g-0.png`),
  ]);
}
