import { Container, Graphics } from "pixi.js";
import {
  arrowColumnRatio,
  circleColumnRatio,
  diamondColumnRatio,
} from "../constants";
import type { Game } from "../game";

export class StageCover {
  public game: Game;

  public view: Container;
  public graphics: Graphics;

  constructor(game: Game) {
    this.game = game;

    this.graphics = new Graphics();

    this.view = new Container();
    this.view.zIndex = 2;
    this.view.addChild(this.graphics);
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

    const width = this.game.difficulty.keyCount * this.game.scaledColumnWidth;

    let y: number;
    let height: number;
    if (this.game.mods.cover.type === "fadeIn") {
      y = position * this.game.mods.cover.amount;
      height = this.game.app.screen.height;
    } else {
      y = 0;
      height = position * (1 - this.game.mods.cover.amount);
    }

    this.graphics.clear().rect(0, y, width, height).fill(0x110000);
  }
}
