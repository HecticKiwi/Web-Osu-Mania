import { TapData } from "@/lib/beatmapParser";
import { circleColumnRatio } from "@/osuMania/constants";
import { Game } from "@/osuMania/game";
import { Graphics, RenderTexture, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class CircleTap extends Tap {
  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const width = game.scaledColumnWidth * circleColumnRatio;
    const height = game.scaledColumnWidth * circleColumnRatio;
    const radius = game.scaledColumnWidth * circleColumnRatio;

    if (!Tap.renderTexture) {
      const graphic = new Graphics()
        .roundRect(0, 0, width, height, radius)
        .fill("white");

      Tap.renderTexture = RenderTexture.create({
        width,
        height,
        antialias: true,
      });

      game.app.renderer.render({
        container: graphic,
        target: Tap.renderTexture,
      });

      graphic.destroy();
    }

    this.view = new Sprite(Tap.renderTexture);
    this.view.tint = game.laneColors[tapData.column].tap;
    this.view.zIndex = 1;
    this.view.pivot.x = width / 2;
    this.view.pivot.y = height / 2;
    this.view.x =
      tapData.column * game.scaledColumnWidth + game.scaledColumnWidth / 2;
    this.view.visible = false;

    this.game.notesContainer.addChild(this.view);
  }
}
