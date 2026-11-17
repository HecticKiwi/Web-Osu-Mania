import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import type { Texture } from "pixi.js";
import { Graphics, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class BarTap extends Tap {
  static textures: {
    tap: Texture[];
    hold: Texture[];
  };

  static setTextures(game: Game) {
    BarTap.textures = {
      tap: [],
      hold: [],
    };

    const width = game.scaledColumnWidth;
    const height = game.scaledColumnWidth * 0.4;
    const strokeWidth = game.settings.skin.borderWidth;

    const graphics = new Graphics();

    const createTexture = (columnIndex: number, isHoldHead?: boolean) => {
      const fillColor = isHoldHead
        ? game.laneColors[columnIndex].holdHead
        : game.laneColors[columnIndex].tap;
      const strokeColor = isHoldHead
        ? game.laneColors[columnIndex].holdHeadBorder
        : game.laneColors[columnIndex].tapBorder;

      graphics.clear().rect(0, 0, width, height).fill(fillColor).stroke({
        width: strokeWidth,
        color: strokeColor,
      });

      const texture = game.app.renderer.generateTexture(graphics);
      return texture;
    };

    for (let i = 0; i < game.difficulty.keyCount; i++) {
      BarTap.textures.tap.push(createTexture(i));
      BarTap.textures.hold.push(createTexture(i, true));
    }

    graphics.destroy();
  }

  static getSprite(game: Game, columnIndex: number, isHoldHead?: boolean) {
    const width = game.scaledColumnWidth;
    const height = game.scaledColumnWidth * 0.4;

    const renderTextures = isHoldHead
      ? BarTap.textures.hold
      : BarTap.textures.tap;

    const sprite = new Sprite(renderTextures[columnIndex]);
    sprite.setSize(width, height);
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
