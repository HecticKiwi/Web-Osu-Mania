import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { SKIN_URL } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";
import { Tap } from "./tap";

export class Key extends Entity {
  private columnId: number;

  public keyTexture: Texture;
  public keyPTexture: Texture;

  public view: Container;
  private hitArea: Graphics;
  private sprite: Sprite;

  constructor(game: Game, columnId: number) {
    super(game);

    this.columnId = columnId;

    this.view = new Container();
    this.view.eventMode = "passive";

    this.sprite = Sprite.from(
      `${SKIN_URL}/${game.skinManiaIni[`KeyImage${columnId}`]}.png`,
    );

    this.keyTexture = Texture.from(
      `${SKIN_URL}/${game.skinManiaIni[`KeyImage${columnId}`]}.png`,
    );
    this.keyPTexture = Texture.from(
      `${SKIN_URL}/${game.skinManiaIni[`KeyImage${columnId}D`]}.png`,
    );

    this.view.eventMode = "static";

    // No idea how the height is determined in the skin.ini so Imma hardcode it
    this.sprite.height = 600;
    this.sprite.eventMode = "passive";
    this.sprite.anchor.set(undefined, 1);
    this.sprite.zIndex = 99;

    this.view.addChild(this.sprite);

    this.hitArea = new Graphics()
      .rect(0, 0, this.view.width, this.game.app.screen.height)
      .fill(0x000000);
    this.hitArea.alpha = 0;
    this.hitArea.pivot.y = this.game.app.screen.height;
    this.hitArea.zIndex = 100;
    this.hitArea.eventMode = "static";
    this.hitArea.cursor = "pointer";

    this.hitArea.on("pointerdown", () => {
      this.game.inputSystem.tappedColumns[this.columnId] = true;
      this.game.inputSystem.pressedColumns[this.columnId] = true;
    });

    this.hitArea.on("pointerup", () => {
      this.game.inputSystem.pressedColumns[this.columnId] = false;
      this.game.inputSystem.releasedColumns[this.columnId] = true;
    });

    this.hitArea.on("pointerupoutside", () => {
      this.game.inputSystem.pressedColumns[this.columnId] = false;
      this.game.inputSystem.releasedColumns[this.columnId] = true;
    });

    this.view.addChild(this.hitArea);
  }

  public update() {
    this.setPressed(this.game.inputSystem.pressedColumns[this.columnId]);

    if (this.game.inputSystem.tappedColumns[this.columnId]) {
      this.playNextHitsounds();
    }
  }

  public resize() {
    this.view.width = this.game.scaledColumnWidth;
    this.view.x =
      this.game.stageSideWidth + this.columnId * this.game.scaledColumnWidth;
    this.view.y = this.game.app.screen.height;
  }

  public setPressed(pressed: boolean) {
    if (pressed) {
      this.sprite.texture = this.keyPTexture;
    } else {
      this.sprite.texture = this.keyTexture;
    }
  }

  private playNextHitsounds() {
    const nextTapNote = this.game.columns[this.columnId].find(
      (hitObject): hitObject is Tap => hitObject.data.type === "tap",
    );

    nextTapNote?.playHitsounds();
  }
}
