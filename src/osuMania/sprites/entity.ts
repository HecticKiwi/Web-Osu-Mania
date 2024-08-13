import { Sprite } from "pixi.js";
import { Game } from "../game";

export class Entity {
  protected game: Game;
  public sprite: Sprite;
  public shouldRemove: boolean = false;

  constructor(game: Game, src: string) {
    this.game = game;
    const sprite = Sprite.from(src);
    this.sprite = sprite;
  }

  public update(dt: number) {}

  public scaleToWidth(width: number) {
    this.sprite.width = width;
    this.sprite.height =
      (width * this.sprite.texture.height) / this.sprite.texture.width;
  }
}
