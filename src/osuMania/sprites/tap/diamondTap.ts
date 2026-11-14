import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import type { Texture } from "pixi.js";
import { Container, Graphics, RenderTexture, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class DiamondTap extends Tap {
  static renderTextures: {
    tap: Texture[];
    hold: Texture[];
  };

  static setRenderTextures(game: Game) {
    DiamondTap.renderTextures = {
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

    const createRenderTexture = (columnIndex: number, isHoldHead?: boolean) => {
      const fillColor = isHoldHead
        ? game.laneColors[columnIndex].tap
        : game.laneColors[columnIndex].holdHead;
      const strokeColor = isHoldHead
        ? game.laneColors[columnIndex].tapBorder
        : game.laneColors[columnIndex].holdHeadBorder;

      graphics
        .clear()
        .roundRect(
          strokeWidth / 2,
          strokeWidth / 2,
          rectangleWidth,
          rectangleHeight,
          cornerRadius,
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
      DiamondTap.renderTextures.tap.push(createRenderTexture(i));
      DiamondTap.renderTextures.hold.push(createRenderTexture(i, true));
    }

    graphics.destroy();
  }

  static getSprite(game: Game, columnIndex: number, isHoldHead?: boolean) {
    const width =
      (game.scaledColumnWidth * game.settings.noteScale) / Math.sqrt(2);
    const height =
      (game.scaledColumnWidth * game.settings.noteScale) / Math.sqrt(2);

    const renderTextures = isHoldHead
      ? DiamondTap.renderTextures.hold
      : DiamondTap.renderTextures.tap;

    const sprite = new Sprite(renderTextures[columnIndex]);

    sprite.width = width;
    sprite.height = height;
    sprite.anchor = 0.5;
    sprite.angle = 90;

    return sprite;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const sprite = DiamondTap.getSprite(
      game,
      tapData.column,
      tapData.isHoldHead,
    );

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
