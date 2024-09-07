import { clamp } from "@/lib/utils";
import * as PIXI from "pixi.js";
import { Container, Graphics } from "pixi.js";
import { Game } from "../game";

export class ProgressBar {
  public game: Game;

  public view: Container;

  public progressBar: PIXI.Graphics;
  public progressBarContainer: PIXI.Container;

  private fullWidth = 400;

  constructor(game: Game) {
    this.game = game;

    const progressBarBg = new Graphics()
      .rect(0, 0, this.fullWidth, 5)
      .fill(0xffffff);
    progressBarBg.alpha = 0.1;

    this.progressBar = new Graphics().rect(0, 0, 0.01, 5).fill(0x71acef);

    this.view = new Container();
    this.view.addChild(progressBarBg);
    this.view.addChild(this.progressBar);
    this.view.interactiveChildren = false;

    this.view.pivot.set(this.fullWidth, 0);
    this.view.y = 95;
  }

  public update(timeElapsed: number, startTime: number, endTime: number) {
    this.progressBar.width =
      clamp((timeElapsed - startTime) / (endTime - startTime), 0, 1) * 400;
  }

  public resize() {
    this.view.x = this.game.app.screen.width - 30;
    this.view.scale.x = Math.min((this.game.app.screen.width - 60) / 400, 1);
  }
}
