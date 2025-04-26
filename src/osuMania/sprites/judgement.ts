import { BASE_PATH } from "@/lib/utils";
import { Judgement as JudgementValue } from "@/types";
import { gsap } from "gsap";
import { Sprite, Texture } from "pixi.js";
import { Game } from "../game";

export class Judgement {
  public game: Game;

  public view: Sprite;
  private timeout: NodeJS.Timeout | null = null;

  public constructor(game: Game) {
    this.game = game;

    this.view = new Sprite();
    this.view.alpha = 0;
    this.view.zIndex = 99;
    this.view.anchor.set(0.5);
  }

  public resize() {
    this.view.x = this.game.app.screen.width / 2;

    if (this.game.settings.upscroll) {
      this.view.y = (this.game.app.screen.height * 2) / 3 - 50;
    } else {
      this.view.y = this.game.app.screen.height / 3;
    }
  }

  public showJudgement(judgement: JudgementValue) {
    this.view.texture = Texture.from(
      `${BASE_PATH}/skin/mania-hit${judgement === 320 ? "300g" : judgement}-0.png`,
    );

    this.view.alpha = 1;
    this.view.scale.set(1);

    if (this.game.settings.performanceMode) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.view.visible = true;

      this.timeout = setTimeout(() => {
        this.view.visible = false;
      }, 1000);
    } else {
      gsap.from(this.view, {
        pixi: {
          scale: 1.2,
        },
        duration: 0.3,
        overwrite: true,
      });

      gsap.to(this.view, {
        pixi: {
          alpha: 0,
        },
        delay: 0.8,
        duration: 0.3,
      });
    }
  }
}
