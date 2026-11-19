import type { TapData } from "@/lib/beatmapParser";
import { clamp } from "@/lib/math";
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

    const strokeWidth = game.settings.skin.borderWidth;

    const graphics = new Graphics();

    const createTexture = (columnIndex: number, isHoldHead?: boolean) => {
      const fillColor = isHoldHead
        ? game.laneColors[columnIndex].holdHead
        : game.laneColors[columnIndex].tap;
      const strokeColor = isHoldHead
        ? game.laneColors[columnIndex].holdHeadBorder
        : game.laneColors[columnIndex].tapBorder;

      const arrowSize = game.scaledColumnWidth * game.settings.noteScale;
      ArrowTap.drawArrow(
        graphics,
        arrowSize,
        game.settings.skin.arrows.thickness,
        game.settings.skin.arrows.rounding,
      );
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
  private static drawArrow(
    graphics: Graphics,
    size: number,
    thicknessPercent: number = 1,
    radiusPercent: number = 1,
  ) {
    const width = 0.35 * size * thicknessPercent;
    const halfWidth = width / 2;

    // A radiusPercent of 0 or 1 will cause rendering issues, so clamp
    const radius = halfWidth * clamp(radiusPercent, 0.01, 0.99);

    graphics.clear();

    // Start at base of left wing
    graphics.moveTo(
      -halfWidth,
      halfWidth * Math.sqrt(2) + halfWidth * 2 - size / 2,
    );

    // Left wing arc
    graphics.arc(
      -size / 2 + halfWidth,
      (halfWidth - radius) * Math.sqrt(2),
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
      -size / 2 + halfWidth - (halfWidth - radius) * Math.sqrt(2),
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
      (halfWidth - radius) * Math.sqrt(2),
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

    const renderTextures = isHoldHead
      ? ArrowTap.textures.hold
      : ArrowTap.textures.tap;

    const sprite = new Sprite(renderTextures[columnIndex]);

    // Scaling is based on the first arrow, which should point orthogonally
    // Diagonal rotation would mess with scaling
    const defaultTexture = renderTextures[0];
    const length = Math.max(defaultTexture.width, defaultTexture.height);
    sprite.scale = width / length;
    sprite.anchor = 0.5;

    return sprite;
  }

  static getKeyGraphics(game: Game, columnIndex: number, fill?: true) {
    const graphics = new Graphics();

    const arrowSize = game.scaledColumnWidth * game.settings.noteScale;
    const keyBorderWidth = 4;
    ArrowTap.drawArrow(
      graphics,
      arrowSize,
      game.settings.skin.arrows.thickness,
      game.settings.skin.arrows.rounding,
    );

    if (fill) {
      graphics.fill("white").stroke({
        width: 4,
        color: "transparent",
      });
    } else {
      graphics.stroke({
        width: 4,
        color: "hsl(0,0%,70%)",
      });
    }

    const bounds = graphics.getLocalBounds();
    graphics.pivot.y = (bounds.maxY + bounds.minY) / 2 - graphics.y;
    graphics.angle = game.laneArrowDirections[columnIndex];

    const width =
      game.scaledColumnWidth * game.settings.noteScale + keyBorderWidth;
    const length = Math.max(graphics.width, graphics.height);
    graphics.scale = width / length;

    return graphics;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    this.view = ArrowTap.getSprite(game, tapData.column, tapData.isHoldHead);
    this.view.x =
      tapData.column * (game.scaledColumnWidth + game.settings.laneSpacing) +
      game.scaledColumnWidth / 2;
    this.view.visible = false;

    this.game.notesContainer.addChild(this.view);
  }
}
