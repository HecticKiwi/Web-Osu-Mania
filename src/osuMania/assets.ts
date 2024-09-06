import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import { SKIN_URL } from "./constants";

export async function loadAssets() {
  const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL!;
  await Assets.load(`${assetsUrl}/RobotoMono.ttf`);
  await Assets.load(`${assetsUrl}/VarelaRound.ttf`);

  const judgementTextures = [
    `${SKIN_URL}/mania-hit0-0.png`,
    `${SKIN_URL}/mania-hit50-0.png`,
    `${SKIN_URL}/mania-hit100-0.png`,
    `${SKIN_URL}/mania-hit200-0.png`,
    `${SKIN_URL}/mania-hit300-0.png`,
    `${SKIN_URL}/mania-hit300g-0.png`,
  ];

  const textures: PIXI.UnresolvedAsset[] = await Promise.all(
    judgementTextures.map(async (filepath) => {
      return {
        alias: filepath,
        src: filepath,
      };
    }),
  );

  Assets.reset();

  Assets.addBundle("gameTextures", textures);

  await Assets.loadBundle("gameTextures");
}
