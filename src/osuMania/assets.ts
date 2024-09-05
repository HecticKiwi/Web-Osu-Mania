import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import { SKIN_URL } from "./constants";

export async function loadAssets(skinManiaIni: any) {
  const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL!;
  await Assets.load(`${assetsUrl}/RobotoMono.ttf`);
  await Assets.load(`${assetsUrl}/VarelaRound.ttf`);

  const judgementTextures = [
    skinManiaIni.Hit0,
    skinManiaIni.Hit50,
    skinManiaIni.Hit100,
    skinManiaIni.Hit200,
    skinManiaIni.Hit300,
    skinManiaIni.Hit300g,
  ];

  const textures: PIXI.UnresolvedAsset[] = await Promise.all(
    judgementTextures.map(async (filepath) => {
      return {
        alias: filepath,
        src: `${SKIN_URL}/${filepath}.png`,
      };
    }),
  );

  Assets.reset();

  Assets.addBundle("gameTextures", textures);

  await Assets.loadBundle("gameTextures");
}
