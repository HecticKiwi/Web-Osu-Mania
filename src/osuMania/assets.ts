import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";
import { Assets, Texture } from "pixi.js";
import { JUDGEMENT_TEXTURES, TEXTURES } from "./constants";

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI(PIXI);

export async function loadAssets() {
  const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL!;
  await Assets.load(`${assetsUrl}/RobotoMono.ttf`);
  await Assets.load(`${assetsUrl}/VarelaRound.ttf`);

  return await Promise.all([
    ...Object.values(TEXTURES).map((filepath) =>
      Assets.load<Texture>(filepath),
    ),
    ...Object.values(JUDGEMENT_TEXTURES).map((filepath) =>
      Assets.load<Texture>(filepath),
    ),
  ]);
}
