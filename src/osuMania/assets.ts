import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import { SKIN_URL } from "./constants";

export async function loadAssets(
  skinManiaIni: any,
  columnCount: number,
  useRetinaAssets?: boolean,
) {
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

  // Columns likely reuse the same textures, load each one once
  const uniqueFilenames = Array.from(
    new Set([...columnTextures, ...stageTextures, ...judgementTextures]),
  );

  const textures: PIXI.UnresolvedAsset[] = await Promise.all(
    uniqueFilenames.map(async (filepath) => {
      if (useRetinaAssets) {
        // Attempt to load retina (@2x) version if it exists
        const response = await fetch(`${SKIN_URL}/${filepath}@2x.png`, {
          method: "HEAD",
        });

        if (response.ok) {
          return {
            alias: filepath,
            src: `${SKIN_URL}/${filepath}@2x.png`,
          };
        }
      }

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
