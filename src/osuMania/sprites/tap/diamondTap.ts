import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import type { Texture } from "pixi.js";
import { Container, Graphics, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class DiamondTap extends Tap {
  static textures: {
    tap: Texture[];
    hold: Texture[];
  };

  static setTextures(game: Game) {
    DiamondTap.textures = {
      tap: [],
      hold: [],
    };

    const width = game.scaledColumnWidth * game.settings.noteScale;
    const height = game.scaledColumnWidth * game.settings.noteScale;

    const rectangleWidth = width / Math.sqrt(2);
    const rectangleHeight = height / Math.sqrt(2);

    const cornerRadius = 8;

    const strokeWidth = game.settings.skin.borderWidth;

    const graphics = new Graphics();

    const createTexture = (columnIndex: number, isHoldHead?: boolean) => {
      const fillColor = isHoldHead
        ? game.laneColors[columnIndex].holdHead
        : game.laneColors[columnIndex].tap;
      const strokeColor = isHoldHead
        ? game.laneColors[columnIndex].holdHeadBorder
        : game.laneColors[columnIndex].tapBorder;

      graphics
        .clear()
        .roundRect(0, 0, rectangleWidth, rectangleHeight, cornerRadius)
        .fill(fillColor)
        .stroke({
          width: strokeWidth,
          color: strokeColor,
        });
      graphics.width = rectangleWidth;
      graphics.height = rectangleHeight;
      graphics.angle = 45;

      // generateTexture() doesn't use the local transforms of the arg,
      // so put the rotated graphics in a container and pass it instead
      const container = new Container();
      container.addChild(graphics);

      const texture = game.app.renderer.generateTexture(container);
      return texture;
    };

    for (let i = 0; i < game.difficulty.keyCount; i++) {
      DiamondTap.textures.tap.push(createTexture(i));
      DiamondTap.textures.hold.push(createTexture(i, true));
    }

    graphics.destroy();
  }

  static getSprite(columnIndex: number, isHoldHead?: boolean) {
    const renderTextures = isHoldHead
      ? DiamondTap.textures.hold
      : DiamondTap.textures.tap;

    const sprite = new Sprite(renderTextures[columnIndex]);
    sprite.anchor = 0.5;

    return sprite;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const sprite = DiamondTap.getSprite(tapData.column, tapData.isHoldHead);

    this.view = new Container();
    this.view.addChild(sprite);
    this.view.zIndex = 1;
    this.view.x =
      tapData.column * (game.scaledColumnWidth + game.settings.laneSpacing) +
      game.scaledColumnWidth / 2;
    this.view.visible = false;

    this.game.notesContainer.addChild(this.view);
  }
}
