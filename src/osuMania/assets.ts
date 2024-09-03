import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";
import { Assets, Texture } from "pixi.js";
import { SKIN_URL } from "./constants";

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI(PIXI);

export async function loadAssets(skinManiaIni: any, columnCount: number) {
  const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL!;
  await Assets.load(`${assetsUrl}/RobotoMono.ttf`);
  await Assets.load(`${assetsUrl}/VarelaRound.ttf`);

  const columns = Array.from({ length: columnCount }, (_, i) => i);

  const columnTextures = columns.flatMap((column) => [
    skinManiaIni[`KeyImage${column}`],
    skinManiaIni[`KeyImage${column}D`],
    skinManiaIni[`NoteImage${column}`],
    skinManiaIni[`NoteImage${column}H`],
    skinManiaIni[`NoteImage${column}L`],
    skinManiaIni[`NoteImage${column}T`],
  ]);

  const stageTextures = [skinManiaIni.StageHint, skinManiaIni.StageLight];

  const judgementTextures = [
    skinManiaIni.Hit0,
    skinManiaIni.Hit50,
    skinManiaIni.Hit100,
    skinManiaIni.Hit200,
    skinManiaIni.Hit300,
    skinManiaIni.Hit300g,
  ];

  return await Promise.all(
    [...columnTextures, ...stageTextures, ...judgementTextures].map(
      (filepath) => {
        const url = `${SKIN_URL}/${filepath}.png`;

        return Assets.load<Texture>(url);
      },
    ),
  );
}
