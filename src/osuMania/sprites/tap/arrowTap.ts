import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import type { Texture } from "pixi.js";
import { Container, Graphics, Sprite } from "pixi.js";
import { Tap } from "./tap";

export class ArrowTap extends Tap {
  private static textures: {
    tap: Texture[];
    hold: Texture[];
  };

  static setTextures(game: Game) {
    ArrowTap.textures = {
      tap: [],
      hold: [],
    };

    // const width = game.scaledColumnWidth * game.settings.noteScale;
    // const height = game.scaledColumnWidth * game.settings.noteScale;

    const strokeWidth = game.settings.skin.borderWidth;

    const graphics = new Graphics();

    const createTexture = (columnIndex: number, isHoldHead?: boolean) => {
      const fillColor = isHoldHead
        ? game.laneColors[columnIndex].holdHead
        : game.laneColors[columnIndex].tap;
      const strokeColor = isHoldHead
        ? game.laneColors[columnIndex].holdHeadBorder
        : game.laneColors[columnIndex].tapBorder;

      ArrowTap.drawArrow(graphics);
      graphics.fill(fillColor).stroke({
        width: strokeWidth,
        color: strokeColor,
      });
      graphics.angle = game.laneArrowDirections[columnIndex];

      // generateTexture() doesn't use the local transforms of the arg,
      // so put the rotated graphics in a container and pass it instead
      const container = new Container();
      container.addChild(graphics);

      const texture = game.app.renderer.generateTexture(container);
      return texture;
    };

    for (let i = 0; i < game.difficulty.keyCount; i++) {
      ArrowTap.textures.tap.push(createTexture(i));
      ArrowTap.textures.hold.push(createTexture(i, true));
    }

    graphics.destroy();
  }

  // Draws an up arrow
  private static drawArrow(graphics: Graphics, radiusPercent: number = 1) {
    const size = 200;
    const width = 50;
    const halfWidth = width / 2;
    const radius = halfWidth * radiusPercent;

    graphics.clear();

    // Start at base of left wing
    graphics.moveTo(
      -halfWidth,
      halfWidth * Math.sqrt(2) + halfWidth * 2 - size / 2,
    );

    // Left wing arc
    graphics.arc(
      -size / 2 + halfWidth,
      halfWidth * Math.sqrt(2) - radius * Math.sqrt(2),
      radius,
      Math.PI / 4,
      (3 * Math.PI) / 4,
    );
    graphics.arc(
      -size / 2 + halfWidth - (halfWidth - radius) * Math.sqrt(2),
      0,
      radius,
      (3 * Math.PI) / 4,
      (5 * Math.PI) / 4,
    );

    // Head arc (pointing upwards)
    graphics.arc(
      0,
      -size / 2 + radius,
      radius,
      (5 * Math.PI) / 4,
      (7 * Math.PI) / 4,
    );

    // Right wing arc
    graphics.arc(
      size / 2 - halfWidth + (halfWidth - radius) * Math.sqrt(2),
      0,
      radius,
      -Math.PI / 4,
      Math.PI / 4,
    );
    graphics.arc(
      size / 2 - halfWidth,
      halfWidth * Math.sqrt(2) - radius * Math.sqrt(2),
      radius,
      Math.PI / 4,
      (3 * Math.PI) / 4,
    );

    // Go to base of right wing
    graphics.lineTo(
      halfWidth,
      halfWidth * Math.sqrt(2) + halfWidth * 2 - size / 2,
    );

    // Tail arcs (at the bottom)
    graphics.arc(width / 2 - radius, size / 2 - radius, radius, 0, Math.PI / 2);
    graphics.arc(
      -width / 2 + radius,
      size / 2 - radius,
      radius,
      Math.PI / 2,
      Math.PI,
    );

    graphics.closePath();

    return graphics;
  }

  static getSprite(game: Game, columnIndex: number, isHoldHead?: boolean) {
    const width = game.scaledColumnWidth * game.settings.noteScale;
    const height = game.scaledColumnWidth * game.settings.noteScale;

    const renderTextures = isHoldHead
      ? ArrowTap.textures.hold
      : ArrowTap.textures.tap;

    const sprite = new Sprite(renderTextures[columnIndex]);
    sprite.width = width;
    sprite.scale.y = sprite.scale.x;
    // sprite.height = height;
    sprite.anchor = 0.5;

    return sprite;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const sprite = ArrowTap.getSprite(game, tapData.column, tapData.isHoldHead);

    this.view = sprite;
    this.view.x =
      tapData.column * (game.scaledColumnWidth + game.settings.laneSpacing) +
      game.scaledColumnWidth / 2;
    this.view.visible = false;

    this.game.notesContainer.addChild(this.view);
  }
}
