import { clamp } from "@/lib/utils";
import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { Container, Graphics } from "pixi.js";
import { Game } from "../game";
import { MAX_HEALTH, MIN_HEALTH } from "../systems/health";

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

    this.healthBar = new Graphics().rect(0, 0, 0.01, 5).fill(0xffffff);

    this.view = new Container();
    this.view.addChild(healthBarBg);
    this.view.addChild(this.healthBar);
    this.view.interactiveChildren = false;

    this.view.pivot.set(this.fullWidth, 0);
    this.view.y = 90;

    if (this.game.settings.performanceMode) {
      this.healthBar.width = this.fullWidth;
    } else {
      gsap.to(this.healthBar, {
        pixi: {
          width: this.fullWidth,
        },
      });
    }
  }

  public setHealth(health: number, lostHealth: boolean) {
    const newWidth =
      clamp(
        (health - MIN_HEALTH) / (MAX_HEALTH - MIN_HEALTH),
        MIN_HEALTH,
        MAX_HEALTH,
      ) * 400;

    if (this.game.settings.performanceMode) {
      this.healthBar.width = newWidth;
    } else {
      gsap.fromTo(
        this.healthBar,
        {
          pixi: {
            tint: lostHealth ? 0xff9494 : 0xffffff,
          },
        },
        {
          pixi: {
            tint: 0xffffff,
            width: newWidth,
          },
          duration: 0.4,
          overwrite: true,
        },
      );
    }
  }

  public resize() {
    this.view.x = this.game.app.screen.width - 30;
    this.view.scale.x = Math.min((this.game.app.screen.width - 60) / 400, 1);
  }
}
