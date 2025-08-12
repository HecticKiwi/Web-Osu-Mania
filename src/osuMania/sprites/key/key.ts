import { Container, Sprite, Texture } from "pixi.js";
import { Game } from "../../game";

export abstract class Key {
  public game: Game;

  protected columnId: number;

  public view: Container;

  protected abstract setKeyGraphics(): void;

  constructor(game: Game, columnId: number) {
    this.game = game;
    this.columnId = columnId;

    this.view = new Container();
    this.view.eventMode = "passive";
    this.view.zIndex = -100;

    this.setKeyGraphics();

    // Used to be the touch hitbox but can't remove since it somehow breaks the marker width
    // I'll fix later maybe
    const background = Sprite.from(Texture.WHITE);
    background.width = game.scaledColumnWidth;

    this.view.addChild(background);
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
