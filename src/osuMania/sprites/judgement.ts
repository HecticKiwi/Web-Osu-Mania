import { Judgement as JudgementValue } from "@/types";
import { gsap } from "gsap";
import { Sprite, Texture } from "pixi.js";
import { SKIN_URL } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";

export class Judgement extends Entity {
  public sprite: Sprite;

  public constructor(game: Game) {
    super(game);
    this.sprite = new Sprite();
    this.sprite.alpha = 0;
    this.sprite.zIndex = 99;
    this.sprite.anchor.set(0.5);
  }

  public resize() {
    this.sprite.x = this.game.app.screen.width / 2;

    if (this.game.settings.upscroll) {
      this.sprite.y = (this.game.app.screen.height * 2) / 3 - 50;
    } else {
      this.sprite.y = this.game.app.screen.height / 3;
    }
  }

  public showJudgement(judgement: JudgementValue) {
    this.sprite.texture = Texture.from(
      `${SKIN_URL}/${this.game.skinManiaIni[`Hit${judgement === 320 ? "300g" : judgement}`]}.png`,
    );

    this.sprite.alpha = 1;
    this.sprite.scale.set(1);

    gsap.from(this.sprite, {
      pixi: {
        scale: 1.2,
      },
      duration: 0.3,
      overwrite: true,
    });

    gsap.to(this.sprite, {
      pixi: {
        alpha: 0,
      },
      delay: 0.8,
      duration: 0.3,
    });
  }
}
