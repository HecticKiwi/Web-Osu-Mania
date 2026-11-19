import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import type { Texture } from "pixi.js";
import { Graphics, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class CircleTap extends Tap {
  private static textures: {
    tap: Texture[];
    hold: Texture[];
  };

  static setTextures(game: Game) {
    CircleTap.textures = {
      tap: [],
      hold: [],
    };

    const radius = (game.scaledColumnWidth * game.settings.noteScale) / 2;
    const strokeWidth = game.settings.skin.borderWidth;

    const graphics = new Graphics();

    const createTexture = (columnIndex: number, isHoldHead?: boolean) => {
      const fillColor = isHoldHead
        ? game.laneColors[columnIndex].holdHead
        : game.laneColors[columnIndex].tap;
      const strokeColor = isHoldHead
        ? game.laneColors[columnIndex].holdHeadBorder
        : game.laneColors[columnIndex].tapBorder;

      graphics.clear().circle(0, 0, radius);
      graphics.fill(fillColor).stroke({
        width: strokeWidth,
        color: strokeColor,
      });

      const texture = game.app.renderer.generateTexture(graphics);
      return texture;
    };

    for (let i = 0; i < game.difficulty.keyCount; i++) {
      CircleTap.textures.tap.push(createTexture(i));
      CircleTap.textures.hold.push(createTexture(i, true));
    }

    graphics.destroy();
  }

  static getSprite(game: Game, columnIndex: number, isHoldHead?: boolean) {
    const width = game.scaledColumnWidth * game.settings.noteScale;
    const height = game.scaledColumnWidth * game.settings.noteScale;

    const renderTextures = isHoldHead
      ? CircleTap.textures.hold
      : CircleTap.textures.tap;

    const sprite = new Sprite(renderTextures[columnIndex]);
    sprite.setSize(width, height);
    sprite.anchor.y = 0.5;

    return sprite;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const sprite = CircleTap.getSprite(
      game,
      tapData.column,
      tapData.isHoldHead,
    );
    sprite.anchor.x = 0.5;

    this.view = sprite;
    this.view.x =
      tapData.column * (game.scaledColumnWidth + game.settings.laneSpacing) +
      game.scaledColumnWidth / 2;
    this.view.visible = false;

    this.game.notesContainer.addChild(this.view);
  }
}
