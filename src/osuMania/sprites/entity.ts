import { Sprite, Container } from "pixi.js";
import { Game } from "../game";

export class Entity {
  protected game: Game;
  public shouldRemove: boolean = false;

  constructor(game: Game) {
    this.game = game;
  }

  public update(dt: number) {}
}
