import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";
import { Assets, Texture } from "pixi.js";
import { JUDGEMENT_TEXTURES, TEXTURES } from "./constants";

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI(PIXI);

export async function loadAssets() {
  await Assets.load("/RobotoMono.ttf");
  await Assets.load("/VarelaRound.ttf");

  return await Promise.all([
    ...Object.values(TEXTURES).map((filepath) =>
      Assets.load<Texture>(filepath),
    ),
    ...Object.values(JUDGEMENT_TEXTURES).map((filepath) =>
      Assets.load<Texture>(filepath),
    ),
  ]);
}
