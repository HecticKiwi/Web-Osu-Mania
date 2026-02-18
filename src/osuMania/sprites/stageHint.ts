import { Container, Graphics } from "pixi.js";
import type { Game } from "../game";

export class StageHint {
  private game: Game;

  public view: Container;
  private graphics: Graphics;

  constructor(game: Game) {
    this.game = game;
    const width = game.difficulty.keyCount * game.scaledColumnWidth;

    const height = 10;
    this.graphics = new Graphics().rect(0, 0, 5, height).fill(0xcccccc);
    this.graphics.width = width;
    this.graphics.pivot.y = height / 2;
    this.graphics.zIndex = -1;

    this.view = new Container();
    this.view.addChild(this.graphics);
    this.view.alpha = this.game.settings.ui.receptorOpacity;
  }

  public resize() {
    this.view.y = this.game.hitPosition;
  }
}
