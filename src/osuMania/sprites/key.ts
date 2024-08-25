import { Sprite, Texture } from "pixi.js";
import { SKIN_DIR, TEXTURES } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";
import next from "next";
import { Tap } from "./tap";

export class Key extends Entity {
  private columnId: number;
  public keyTexture: Texture = Texture.from(TEXTURES.KEY1);
  public keyPTexture: Texture = Texture.from(TEXTURES.KEY1P);
  public sprite: Sprite;

  constructor(game: Game, columnId: number) {
    super(game);

    this.sprite = Sprite.from(
      `${SKIN_DIR}/${game.skinManiaIni[`KeyImage${columnId}`]}.png`,
    );

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

  public update() {
    const keybind = this.game.columnKeybinds[this.columnId];

    this.setPressed(this.game.inputSystem.pressedKeys.has(keybind));

    if (this.game.inputSystem.tappedKeys.has(keybind)) {
      const nextTapNote = this.game.columns[this.columnId].find(
        (hitObject): hitObject is Tap => hitObject.data.type === "tap",
      );

      nextTapNote?.playHitsounds();
    }
  }
}
