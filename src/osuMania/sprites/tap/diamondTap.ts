import type { TapData } from "@/lib/beatmapParser";
import { diamondColumnRatio } from "@/osuMania/constants";
import type { Game } from "@/osuMania/game";
import { Container, Graphics, RenderTexture, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class DiamondTap extends Tap {
  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const width = game.scaledColumnWidth * diamondColumnRatio;
    const height = game.scaledColumnWidth * diamondColumnRatio;

    const rectangleWidth = width / Math.sqrt(2);
    const rectangleHeight = height / Math.sqrt(2);

    const cornerRadius = 8;

    if (!Tap.renderTexture) {
      const graphic = new Graphics()
        .roundRect(0, 0, rectangleWidth, rectangleHeight, cornerRadius)
        .fill("white");

      Tap.renderTexture = RenderTexture.create({
        width: rectangleWidth,
        height: rectangleHeight,
        antialias: true,
      });

      game.app.renderer.render({
        container: graphic,
        target: Tap.renderTexture,
      });

      graphic.destroy();
    }

    const sprite = Sprite.from(Tap.renderTexture);
    sprite.angle = 45;

    this.view = new Container();
    this.view.addChild(sprite);
    this.view.zIndex = 1;
    this.view.pivot.y = height / 2 / this.view.scale.y;
    this.view.x =
      tapData.column * game.scaledColumnWidth + game.scaledColumnWidth / 2;
    this.view.visible = false;

    if (this.data.isHoldHead) {
      this.view.tint = game.laneColors[tapData.column].holdHead;
    } else {
      this.view.tint = game.laneColors[tapData.column].tap;
    }

    this.game.notesContainer.addChild(this.view);
  }
}
