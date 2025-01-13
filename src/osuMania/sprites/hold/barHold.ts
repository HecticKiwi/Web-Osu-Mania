import { HoldData } from "@/lib/beatmapParser";
import { Container, Sprite, Texture } from "pixi.js";
import { Game } from "../../game";
import { Hold } from "./hold";

export class BarHold extends Hold {
  protected head?: Sprite;

  constructor(game: Game, holdData: HoldData) {
    super(game, holdData);

    this.body = Sprite.from(Texture.WHITE);
    this.body.width = this.game.scaledColumnWidth;

    this.view = new Container();
    this.view.addChild(this.body);
    this.view.tint = game.laneColors[holdData.column];
    this.view.pivot.x = this.view.width / 2;
    this.view.x =
      holdData.column * this.game.scaledColumnWidth +
      this.game.scaledColumnWidth / 2;
    this.view.visible = false;

    const width = game.scaledColumnWidth;
    const height = width * 0.4;

    if (game.settings.darkerHoldNotes) {
      const tail = Sprite.from(Texture.WHITE);
      tail.width = width;
      tail.height = height;
      tail.anchor.y = 1;
      this.view.addChild(tail);

      this.head = Sprite.from(Texture.WHITE);
      this.head.width = width;
      this.head.height = height;
      this.head.anchor.y = 1;
      this.view.addChild(this.head);

      tail.tint = "hsl(0,0%,60%)";
      this.body.tint = "hsl(0,0%,60%)";
    }

    this.setViewHeight();
    this.game.notesContainer.addChild(this.view);
  }
}
