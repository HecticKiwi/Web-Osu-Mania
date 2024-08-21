import { gsap } from "gsap";
import { TEXTURES } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";
import { Sprite } from "pixi.js";

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

  public update(dt: number) {
    if (this.game.settings.autoplay) {
      return;
    }

    if (
      this.game.inputSystem.tappedKeys.has(
        this.game.columnKeybinds[this.columnId],
      )
    ) {
      gsap.killTweensOf(this.sprite);
      this.sprite.alpha = 1;
    }

    if (
      this.game.inputSystem.releasedKeys.has(
        this.game.columnKeybinds[this.columnId],
      )
    ) {
      this.light();
    }
  }

  public light() {
    gsap.killTweensOf(this.sprite);
    this.sprite.alpha = 1;

    gsap.to(this.sprite, {
      pixi: {
        alpha: 0,
      },
      duration: 0.3,
    });
  }
}
