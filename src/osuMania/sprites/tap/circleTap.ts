import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import type { Texture } from "pixi.js";
import { Graphics, RenderTexture, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class CircleTap extends Tap {
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

    const graphics = new Graphics();

    const createRenderTexture = (columnIndex: number, isHoldHead?: boolean) => {
      const fillColor = isHoldHead
        ? game.laneColors[columnIndex].tap
        : game.laneColors[columnIndex].holdHead;
      const strokeColor = isHoldHead
        ? game.laneColors[columnIndex].tapBorder
        : game.laneColors[columnIndex].holdHeadBorder;

      graphics
        .clear()
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
        width: graphics.width,
        height: graphics.height,
        antialias: true,
      });

      game.app.renderer.render({
        container: graphics,
        target: renderTexture,
      });

      return renderTexture;
    };

    for (let i = 0; i < game.difficulty.keyCount; i++) {
      CircleTap.renderTextures.tap.push(createRenderTexture(i));
      CircleTap.renderTextures.hold.push(createRenderTexture(i, true));
    }

    graphics.destroy();
  }

  static getSprite(game: Game, columnIndex: number, isHoldHead?: boolean) {
    const width = game.scaledColumnWidth * game.settings.noteScale;
    const height = game.scaledColumnWidth * game.settings.noteScale;

    const renderTextures = isHoldHead
      ? CircleTap.renderTextures.hold
      : CircleTap.renderTextures.tap;

    const sprite = new Sprite(renderTextures[columnIndex]);
    sprite.width = width;
    sprite.height = height;
    sprite.anchor = 0.5;

    return sprite;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const sprite = CircleTap.getSprite(
      game,
      tapData.column,
      tapData.isHoldHead,
    );

    this.view = sprite;
    this.view.x =
      tapData.column * (game.scaledColumnWidth + game.settings.laneSpacing) +
      game.scaledColumnWidth / 2;
    this.view.visible = false;

    this.game.notesContainer.addChild(this.view);
  }
}
