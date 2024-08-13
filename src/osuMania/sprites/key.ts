import { gsap } from "gsap";
import { SKIN_DIR, TEXTURES, config } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";
import { Texture } from "pixi.js";

export class Key extends Entity {
  private columnId: number;
  public keyTexture: Texture = Texture.from(TEXTURES.KEY1);
  public keyPTexture: Texture = Texture.from(TEXTURES.KEY1P);

  constructor(game: Game, columnId: number) {
    super(game, `${SKIN_DIR}/${game.skinManiaIni[`KeyImage${columnId}`]}.png`);

    this.keyTexture = Texture.from(
      `${SKIN_DIR}/${game.skinManiaIni[`KeyImage${columnId}`]}.png`,
    );
    this.keyPTexture = Texture.from(
      `${SKIN_DIR}/${game.skinManiaIni[`KeyImage${columnId}D`]}.png`,
    );

    this.columnId = columnId;
  }

  public setPressed(pressed: boolean) {
    if (pressed) {
      this.sprite.texture = this.keyPTexture;
    } else {
      this.sprite.texture = this.keyTexture;
    }
  }

  public update(dt: number) {
    if (!this.game.settings.autoplay) {
      this.setPressed(
        this.game.inputSystem.pressedKeys.has(
          this.game.beatmapConfig.columnKeys[this.columnId],
        ),
      );
    }
  }
}
