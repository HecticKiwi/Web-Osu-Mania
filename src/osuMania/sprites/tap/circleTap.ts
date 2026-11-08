import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import { Graphics, RenderTexture, Sprite, Texture } from "pixi.js";
import { Tap } from "./tap";

export class CircleTap extends Tap {
  static renderTexture: Texture[];
  static renderTextures: {
    tap: Texture[];
    hold: Texture[];
  };

  static setRenderTextures(game: Game) {
    CircleTap.renderTextures = {
      tap: [],
      hold: [],
    };

    const width = game.scaledColumnWidth * game.settings.noteScale;
    const height = game.scaledColumnWidth * game.settings.noteScale;

    const strokeWidth = game.settings.skin.borderWidth;
    const radius = (game.scaledColumnWidth * game.settings.noteScale) / 2;

    const createRenderTexture = (columnIndex: number, isHoldHead?: boolean) => {
      const fillColor = game.laneColors[columnIndex].tap;
      const strokeColor = game.laneColors[columnIndex].tapBorder;

      const graphic = new Graphics()
        .circle(
          width / 2 + strokeWidth / 2,
          height / 2 + strokeWidth / 2,
          radius,
        )
        .fill(fillColor)
        .stroke({
          width: strokeWidth,
          color: strokeColor,
        });

      const renderTexture = RenderTexture.create({
        width: graphic.width,
        height: graphic.height,
        antialias: true,
      });

      game.app.renderer.render({
        container: graphic,
        target: renderTexture,
      });

      graphic.destroy();

      return renderTexture;
    };

    for (let i = 0; i < game.columns.length; i++) {
      CircleTap.renderTextures.tap.push(createRenderTexture(i));
      CircleTap.renderTextures.hold.push(createRenderTexture(i, true));
    }
  }
  static getSprite(game: Game, test?: boolean) {
    const width = game.scaledColumnWidth * game.settings.noteScale;
    const height = game.scaledColumnWidth * game.settings.noteScale;

    if (!Tap.renderTexture) {
      const strokeWidth = game.settings.skin.borderWidth;
      const radius = (game.scaledColumnWidth * game.settings.noteScale) / 2;

      const graphic = new Graphics()
        .circle(
          width / 2 + strokeWidth / 2,
          height / 2 + strokeWidth / 2,
          radius,
        )
        .fill("white")
        .stroke({
          width: strokeWidth,
          color: "red",
        });

      Tap.renderTexture = RenderTexture.create({
        width: graphic.width,
        height: graphic.height,
        antialias: true,
      });

      game.app.renderer.render({
        container: graphic,
        target: Tap.renderTexture,
      });

      graphic.destroy();
    }

    const sprite = new Sprite(Tap.renderTexture);
    sprite.width = width;
    sprite.height = height;

    return sprite;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const sprite = CircleTap.getSprite(game);
    sprite.anchor = 0.5;
    this.view = sprite;
    this.view.x =
      tapData.column * (game.scaledColumnWidth + game.settings.laneSpacing) +
      game.scaledColumnWidth / 2;
    this.view.visible = false;

    if (this.data.isHoldHead) {
      this.view.tint = game.laneColors[tapData.column].holdHead;
    } else {
      this.view.tint = game.laneColors[tapData.column].tap;
    }

    this.game.notesContainer.addChild(this.view);
  }
}
