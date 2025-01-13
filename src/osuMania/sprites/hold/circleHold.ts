import { HoldData } from "@/lib/beatmapParser";
import { Container, Sprite, Texture } from "pixi.js";
import { circleColumnRatio } from "../../constants";
import { Game } from "../../game";
import { Tap } from "../tap/tap";
import { Hold } from "./hold";

export class CircleHold extends Hold {
  protected head?: Sprite;

  constructor(game: Game, holdData: HoldData) {
    super(game, holdData);

    this.body = Sprite.from(Texture.WHITE);
    this.body.width = this.game.scaledColumnWidth * circleColumnRatio;

    this.view = new Container();
    this.view.addChild(this.body);
    this.view.tint = game.laneColors[holdData.column];
    this.view.pivot.x = this.view.width / 2;
    this.view.x =
      holdData.column * this.game.scaledColumnWidth +
      this.game.scaledColumnWidth / 2;
    this.view.visible = false;

    const tail = new Sprite(Tap.renderTexture!);
    tail.pivot.y = tail.height / 2;
    this.view.addChild(tail);

    if (game.settings.darkerHoldNotes) {
      this.body.tint = "hsl(0,0%,60%)";
      tail.tint = "hsl(0,0%,60%)";
    }

    this.head = new Sprite(Tap.renderTexture!);
    this.head.anchor.y = 0.5;

    this.view.addChild(this.head);

    this.setViewHeight();
    this.game.notesContainer.addChild(this.view);
  }
}
