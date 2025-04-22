import { Container, Sprite, Texture } from "pixi.js";
import { Game } from "../../game";

export abstract class Key {
  public game: Game;

  protected columnId: number;

  public view: Container;
  protected hitArea: Sprite;

  protected abstract setKeyGraphics(): void;

  constructor(game: Game, columnId: number) {
    this.game = game;
    this.columnId = columnId;

    this.view = new Container();
    this.view.eventMode = "passive";
    this.view.zIndex = -100;

    this.setKeyGraphics();

    const hitArea = Sprite.from(Texture.WHITE);
    this.hitArea = hitArea;
    hitArea.width = game.scaledColumnWidth;
    hitArea.height = this.game.app.screen.height;
    hitArea.alpha = 0;
    hitArea.anchor.y = 1;

    if (!this.game.replayPlayer) {
      hitArea.eventMode = "static";
      hitArea.cursor = "pointer";

      hitArea.on("pointerdown", () => {
        this.game.inputSystem.hit(this.columnId);
      });

      hitArea.on("pointerup", () => {
        this.game.inputSystem.release(this.columnId);
      });

      hitArea.on("pointerupoutside", () => {
        this.game.inputSystem.pressedColumns[this.columnId] = false;
        this.game.inputSystem.releasedColumns[this.columnId] = true;

        this.game.inputSystem.release(this.columnId);
      });
    }

    this.view.addChild(hitArea);
    this.view.x =
      this.game.stageSideWidth + this.columnId * this.game.scaledColumnWidth;
  }

  public update() {
    this.setPressed(this.game.inputSystem.pressedColumns[this.columnId]);
  }

  public resize() {
    this.view.y = this.game.app.screen.height;
  }

  public abstract setPressed(pressed: boolean): void;
}
