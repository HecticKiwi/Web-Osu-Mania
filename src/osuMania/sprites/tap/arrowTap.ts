import type { TapData } from "@/lib/beatmapParser";
import { BASE_PATH } from "@/lib/utils";
import type { Game } from "@/osuMania/game";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Tap } from "./tap";

export class ArrowTap extends Tap {
  public static getArrowSprite(game: Game, column: number) {
    if (!Tap.renderTexture) {
      Tap.renderTexture = Texture.from(
        game.settings.style === "arrows"
          ? `${BASE_PATH}/skin/arrow.svg`
          : `${BASE_PATH}/skin/arrowThick.svg`,
      );
    }

    const width = game.scaledColumnWidth * game.settings.noteScale;
    const height = game.scaledColumnWidth * game.settings.noteScale;

    const sprite = Sprite.from(Tap.renderTexture);
    sprite.width = width;
    sprite.height = height;
    sprite.zIndex = 1;
    sprite.anchor.set(0.5);

    sprite.angle = game.laneArrowDirections[column];

    const container = new Container();
    container.addChild(sprite);

    if (game.settings.upscroll) {
      container.scale.y = -container.scale.y;
    }

    return container;
  }

  private drawArrow(size = 200, radius = 30) {
    // Draw a right arrow
    const graphics = new Graphics();

    // Start at base of top wing
    graphics.moveTo(
      size - radius * Math.sqrt(2) - radius * 2,
      size / 2 - radius,
    );

    // Top wing arc
    graphics.arc(
      size / 2,
      radius,
      radius,
      (Math.PI * 3) / 4,
      (2 * (Math.PI * 7)) / 8,
    );

    // Head arc
    graphics.arc(
      size - radius,
      size / 2,
      radius,
      (2 * (Math.PI * 7)) / 8,
      (2 * Math.PI) / 8,
    );

    // Bottom wing arc
    graphics.arc(
      size / 2,
      size - radius,
      radius,
      (2 * (Math.PI * 1)) / 8,
      (2 * (Math.PI * 5)) / 8,
    );

    // Go to base of bottom wing
    graphics.lineTo(
      size - radius * Math.sqrt(2) - radius * 2,
      size / 2 + radius,
    );

    // Tail arc
    graphics.arc(radius, size / 2, radius, Math.PI / 2, (Math.PI * 3) / 2);
    graphics.closePath();

    graphics.fill("white");

    graphics.stroke({
      width: 4,
      color: "blue",
    });

    graphics.x = 100;
    graphics.y = 100;

    this.game.app.stage.addChild(graphics);

    return graphics;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    if (!ArrowTap.renderTexture) {
      this.drawArrow();
    }

    this.view = ArrowTap.getArrowSprite(game, tapData.column);
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
