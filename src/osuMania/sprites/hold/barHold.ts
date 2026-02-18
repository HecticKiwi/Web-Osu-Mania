import type { HoldData } from "@/lib/beatmapParser";
import { Container, Sprite, Texture } from "pixi.js";
import type { Game } from "../../game";
import { Hold } from "./hold";

export class BarHold extends Hold {
  protected head?: Sprite;

  constructor(game: Game, holdData: HoldData) {
    super(game, holdData);

    this.body = Sprite.from(Texture.WHITE);
    this.body.width = this.game.scaledColumnWidth;
    this.body.tint = game.laneColors[holdData.column].hold;

    this.view = new Container();
    this.view.addChild(this.body);
    this.view.pivot.x = this.view.width / 2;
    this.view.x =
      holdData.column * this.game.scaledColumnWidth +
      this.game.scaledColumnWidth / 2;
    this.view.visible = false;

    const width = game.scaledColumnWidth;
    const height = width * 0.4;

    if (
      game.settings.darkerHoldNotes ||
      game.settings.skin.colors.mode === "custom"
    ) {
      const tail = Sprite.from(Texture.WHITE);
      tail.width = width;
      tail.height = height;
      tail.anchor.y = 1;
      tail.tint = game.laneColors[holdData.column].hold;
      this.view.addChild(tail);

      this.head = Sprite.from(Texture.WHITE);
      this.head.width = width;
      this.head.height = height;
      this.head.anchor.y = 1;
      this.head.tint = game.laneColors[holdData.column].holdHead;
      this.view.addChild(this.head);
    }

    this.setViewHeight();
    this.game.notesContainer.addChild(this.view);
  }
}
