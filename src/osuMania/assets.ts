import { Assets } from "pixi.js";

export async function loadAssets() {
  await Assets.load(`/RobotoMono.ttf`);
  await Assets.load(`/VarelaRound.ttf`);

  await Promise.all([
    await Assets.load(`/skin/mania-hit0-0.png`),
    await Assets.load(`/skin/mania-hit50-0.png`),
    await Assets.load(`/skin/mania-hit100-0.png`),
    await Assets.load(`/skin/mania-hit200-0.png`),
    await Assets.load(`/skin/mania-hit300-0.png`),
    await Assets.load(`/skin/mania-hit300g-0.png`),
  ]);
}
