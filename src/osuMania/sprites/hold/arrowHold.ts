import { HoldData } from "@/lib/beatmapParser";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Game } from "../../game";
import { ArrowTap } from "../tap/arrowTap";
import { Hold } from "./hold";

export class ArrowHold extends Hold {
  constructor(game: Game, holdData: HoldData) {
    super(game, holdData);

    const bodyWidth = this.game.scaledColumnWidth * 0.6;

    this.body = Sprite.from(Texture.WHITE);
    this.body.width = bodyWidth;

    this.view = new Container();
    this.view.addChild(this.body);
    this.view.tint = game.laneColors[holdData.column];
    this.view.pivot.x = this.view.width / 2;
    this.view.x =
      holdData.column * this.game.scaledColumnWidth +
      this.game.scaledColumnWidth / 2;
    this.view.visible = false;

    const tail = new Graphics()
      .lineTo(bodyWidth / 2, -bodyWidth / 2)
      .lineTo(bodyWidth, 0)
      .fill("white");
    this.view.addChild(tail);

    if (game.settings.darkerHoldNotes) {
      this.body.tint = "hsl(0,0%,60%)";
      tail.tint = "hsl(0,0%,60%)";
    }

    this.head = ArrowTap.getArrowSprite(game, holdData.column);
    this.head.x = (this.game.scaledColumnWidth * 0.6) / 2;
    this.view.addChild(this.head);

    this.setViewHeight();
    this.game.notesContainer.addChild(this.view);
  }
}
