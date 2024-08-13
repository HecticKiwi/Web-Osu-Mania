import { Judgement as JudgementValue } from "@/types";
import { gsap } from "gsap";
import { Texture } from "pixi.js";
import { JUDGEMENT_TEXTURES } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";

export class Judgement extends Entity {
  public constructor(game: Game) {
    super(game, JUDGEMENT_TEXTURES[300]);
    this.sprite.alpha = 0;
  }

  public showJudgement(judgement: JudgementValue) {
    this.sprite.texture = Texture.from(JUDGEMENT_TEXTURES[judgement]);

    gsap.killTweensOf(this.sprite);

    this.sprite.alpha = 1;
    this.sprite.scale.set(1);

    gsap.from(this.sprite, {
      pixi: {
        scale: 1.2,
      },
      duration: 0.3,
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
