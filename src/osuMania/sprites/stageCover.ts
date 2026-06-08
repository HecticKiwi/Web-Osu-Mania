import { FillGradient, Graphics, RenderTexture, Sprite } from "pixi.js";
import {
  arrowColumnRatio,
  circleColumnRatio,
  diamondColumnRatio,
} from "../constants";
import type { Game } from "../game";

export class StageCover {
  public game: Game;

  public view: Sprite;

  constructor(game: Game) {
    this.game = game;

    this.view = new Sprite();
    this.view.zIndex = 2;
  }

  public resize() {
    if (!this.game.mods.cover) {
      throw new Error("Cover mod not enabled");
    }

    let position = this.game.hitPosition;
    if (this.game.settings.style === "circles") {
      position += (this.game.scaledColumnWidth * circleColumnRatio) / 2;
    } else if (this.game.settings.style === "arrows") {
      position += (this.game.scaledColumnWidth * arrowColumnRatio) / 2;
    } else if (this.game.settings.style === "diamonds") {
      position += (this.game.scaledColumnWidth * diamondColumnRatio) / 2;
    }

    const graphics = new Graphics();
    const width = this.game.difficulty.keyCount * this.game.scaledColumnWidth;
    let height: number;

    if (this.game.mods.cover.type === "fadeIn") {
      height = this.game.app.screen.height;

      // Solid portion
      graphics
        .clear()
        .rect(0, position * (this.game.mods.cover.amount + 0.25), width, height)
        .fill(0xffffff);

      const fillGradient = new FillGradient({
        start: {
          x: 0,
          y: 0,
        },
        end: {
          x: 0,
          y: 1,
        },
        colorStops: [
          {
            offset: 0,
            color: "rgba(255, 0, 0, 0)",
          },
          {
            offset: 1,
            color: "rgba(255, 0, 0, 1)",
          },
        ],
      });

      // Gradient fade portion
      graphics
        .rect(0, position * this.game.mods.cover.amount, width, position * 0.25)
        .fill(fillGradient);
    } else {
      height = position * (1 - this.game.mods.cover.amount);

      // Solid portion
      graphics
        .clear()
        .rect(0, 0, width, position * (1 - this.game.mods.cover.amount - 0.25))
        .fill(0xffffff);

      const fillGradient = new FillGradient({
        start: {
          x: 0,
          y: 0,
        },
        end: {
          x: 0,
          y: 1,
        },
        colorStops: [
          {
            offset: 0,
            color: "rgba(255, 0, 0, 1)",
          },
          {
            offset: 1,
            color: "rgba(255, 0, 0, 0)",
          },
        ],
      });

      // Gradient fade portion
      graphics
        .rect(
          0,
          position * (1 - this.game.mods.cover.amount - 0.25),
          width,
          position * 0.25,
        )
        .fill(fillGradient);
    }

    const texture = RenderTexture.create({
      width,
      height,
      antialias: true,
    });

    this.game.app.renderer.render({
      container: graphics,
      target: texture,
    });

    this.view.texture = texture;
  }
}
