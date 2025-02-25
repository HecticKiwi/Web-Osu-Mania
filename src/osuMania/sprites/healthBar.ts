import { clamp } from "@/lib/utils";
import * as PIXI from "pixi.js";
import { Container, Graphics } from "pixi.js";
import { Game } from "../game";

export class HealthBar {
  public game: Game;

  public view: Container;

  public healthBar: PIXI.Graphics;
  public healthBarContainer: PIXI.Container;

  private fullWidth = 400;

  constructor(game: Game) {
    this.game = game;

    const healthBarBg = new Graphics()
      .rect(0, 0, this.fullWidth, 5)
      .fill(0xffffff);
    healthBarBg.alpha = 0.1;

    this.healthBar = new Graphics().rect(0, 0, 0.01, 5).fill(0xe69138);

    this.view = new Container();
    this.view.addChild(healthBarBg);
    this.view.addChild(this.healthBar);
    this.view.interactiveChildren = false;

    this.view.pivot.set(this.fullWidth, 0);
    this.view.y = 95;
  }

  public update(health: number, min: number, max: number) {
    this.healthBar.width =
      clamp((health - min) / (max - min), 0, 1) * 400;
  }

  public resize() {
    this.view.x = 30 + this.fullWidth;
    this.view.scale.x = Math.min((this.game.app.screen.width - 60) / 400, 1);
  }
}