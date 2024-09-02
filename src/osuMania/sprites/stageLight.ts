import { gsap } from "gsap";
import { Sprite } from "pixi.js";
import { TEXTURES } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";

export class StageLight extends Entity {
  private columnId: number;
  public sprite: Sprite;

  constructor(game: Game, columnId: number) {
    super(game);
    this.sprite = Sprite.from(TEXTURES.STAGE_LIGHT);

    this.columnId = columnId;

    this.sprite.alpha = 0;
    this.sprite.tint = `rgb(${game.skinManiaIni[`ColourLight${columnId + 1}`]})`;
  }

  public update() {
    if (this.game.inputSystem.pressedColumns[this.columnId]) {
      gsap.killTweensOf(this.sprite);
      this.sprite.alpha = 1;
    }

    if (this.game.inputSystem.releasedColumns[this.columnId]) {
      this.light();
    }
  }

  public resize() {
    this.sprite.y = this.game.hitPosition;
  }

  public light() {
    this.sprite.alpha = 1;

    gsap.to(this.sprite, {
      pixi: {
        alpha: 0,
      },
      duration: 0.3,
      overwrite: true,
    });
  }
}
