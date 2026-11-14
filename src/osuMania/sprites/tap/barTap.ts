import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import type { Texture } from "pixi.js";
import { Graphics, RenderTexture, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class BarTap extends Tap {
  static renderTextures: {
    tap: Texture[];
    hold: Texture[];
  };

  static setRenderTextures(game: Game) {
    BarTap.renderTextures = {
      tap: [],
      hold: [],
    };

    const width = game.scaledColumnWidth;
    const height = game.scaledColumnWidth * 0.4;

    const strokeWidth = game.settings.skin.borderWidth;

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
        .rect(strokeWidth / 2, strokeWidth / 2, width, height)
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
      BarTap.renderTextures.tap.push(createRenderTexture(i));
      BarTap.renderTextures.hold.push(createRenderTexture(i, true));
    }

    graphics.destroy();
  }

  static getSprite(game: Game, columnIndex: number, isHoldHead?: boolean) {
    const width = game.scaledColumnWidth;
    const height = game.scaledColumnWidth * 0.4;

    const renderTextures = isHoldHead
      ? BarTap.renderTextures.hold
      : BarTap.renderTextures.tap;

    const sprite = new Sprite(renderTextures[columnIndex]);
    sprite.width = width;
    sprite.height = height;
    sprite.anchor.y = 1;

    return sprite;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const sprite = BarTap.getSprite(game, tapData.column, tapData.isHoldHead);
    sprite.anchor.x = 0.5;

    this.view = sprite;
    this.view.x =
      tapData.column * (game.scaledColumnWidth + game.settings.laneSpacing) +
      game.scaledColumnWidth / 2;
    this.view.visible = false;

    this.game.notesContainer.addChild(this.view);
  }
}
