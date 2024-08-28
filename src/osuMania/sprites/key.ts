import { Sprite, Texture } from "pixi.js";
import { SKIN_DIR, TEXTURES } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";
import { Tap } from "./tap";

export class Key extends Entity {
  public sprite: Sprite;
  public keyTexture: Texture = Texture.from(TEXTURES.KEY1);
  public keyPTexture: Texture = Texture.from(TEXTURES.KEY1P);

  private columnId: number;

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

    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";

    this.sprite.on("pointerdown", () => {
      this.game.inputSystem.tappedColumns[this.columnId] = true;
      this.game.inputSystem.pressedColumns[this.columnId] = true;
    });

    this.sprite.on("pointerup", () => {
      this.game.inputSystem.pressedColumns[this.columnId] = false;
      this.game.inputSystem.releasedColumns[this.columnId] = true;
    });

    this.sprite.on("pointerupoutside", () => {
      this.game.inputSystem.pressedColumns[this.columnId] = false;
      this.game.inputSystem.releasedColumns[this.columnId] = true;
    });
  }

  public setPressed(pressed: boolean) {
    if (pressed) {
      this.sprite.texture = this.keyPTexture;
    } else {
      this.sprite.texture = this.keyTexture;
    }
  }

  public update() {
    this.setPressed(this.game.inputSystem.pressedColumns[this.columnId]);

    if (this.game.inputSystem.tappedColumns[this.columnId]) {
      this.playNextHitsounds();
    }
  }

  private playNextHitsounds() {
    const nextTapNote = this.game.columns[this.columnId].find(
      (hitObject): hitObject is Tap => hitObject.data.type === "tap",
    );

    nextTapNote?.playHitsounds();
  }
}
