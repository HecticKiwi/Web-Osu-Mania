import type { HoldData } from "@/lib/beatmapParser";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import type { Game } from "../../game";
import { CircleTap } from "../tap/circleTap";
import { Hold } from "./hold";

export class CircleHold extends Hold {
  protected head?: Sprite;

  constructor(game: Game, holdData: HoldData) {
    super(game, holdData);

    const width = this.game.scaledColumnWidth * this.game.settings.noteScale;

    this.body = Sprite.from(Texture.WHITE);
    this.body.width =
      this.game.scaledColumnWidth * this.game.settings.noteScale;
    this.body.tint = game.laneColors[holdData.column].hold;

    this.view = new Container();
    this.view.addChild(this.body);
    this.view.pivot.x = this.view.width / 2;
    this.view.x =
      holdData.column * (game.scaledColumnWidth + game.settings.laneSpacing) +
      game.scaledColumnWidth / 2;
    this.view.visible = false;

    const tail = new Graphics()
      .circle(width / 2, width / 2, width / 2)
      .fill(game.laneColors[holdData.column].hold);
    tail.pivot.y = tail.height / 2;
    this.view.addChild(tail);

    this.head = CircleTap.getSprite(game, holdData.column, true);
    this.head.anchor.y = 0.5;

    this.view.addChild(this.head);

    this.game.notesContainer.addChild(this.view);
  }
}
