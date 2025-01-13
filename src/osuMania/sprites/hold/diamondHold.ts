import { HoldData } from "@/lib/beatmapParser";
import { Container, Graphics, GraphicsContext, Sprite, Texture } from "pixi.js";
import { Game } from "../../game";
import { Tap } from "../tap/tap";
import { Hold } from "./hold";

export class DiamondHold extends Hold {
  protected head?: Sprite;

  public static tailGraphicsContext: GraphicsContext | null;

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

    if (!DiamondHold.tailGraphicsContext) {
      DiamondHold.tailGraphicsContext = new GraphicsContext()
        .lineTo(bodyWidth / 2, -bodyWidth / 2)
        .lineTo(bodyWidth, 0)
        .fill("white");
    }

    const tail = new Graphics(DiamondHold.tailGraphicsContext);
    this.view.addChild(tail);

    if (game.settings.darkerHoldNotes) {
      this.body.tint = "hsl(0,0%,60%)";
      tail.tint = "hsl(0,0%,60%)";
    }

    this.head = new Sprite(Tap.renderTexture!);
    this.head.anchor.x = 0.5;
    this.head.anchor.y = 0.5;
    this.head.angle = 45;
    this.head.x = this.body.width / 2;

    this.view.addChild(this.head);

    this.setViewHeight();
    this.game.notesContainer.addChild(this.view);
  }
}
