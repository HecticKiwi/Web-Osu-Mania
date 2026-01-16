import { HoldData } from "@/lib/beatmapParser";
import { Container, Graphics, GraphicsContext, Sprite, Texture } from "pixi.js";
import { Game } from "../../game";
import { ArrowTap } from "../tap/arrowTap";
import { Hold } from "./hold";

export class ArrowHold extends Hold {
  public static tailGraphicsContext: GraphicsContext | null;

  constructor(game: Game, holdData: HoldData) {
    super(game, holdData);

    const bodyWidth = this.game.scaledColumnWidth * 0.6;

    this.body = Sprite.from(Texture.WHITE);
    this.body.width = bodyWidth;
    this.body.tint = game.laneColors[holdData.column].hold;

    this.view = new Container();
    this.view.addChild(this.body);
    this.view.pivot.x = this.view.width / 2;
    this.view.x =
      holdData.column * this.game.scaledColumnWidth +
      this.game.scaledColumnWidth / 2;
    this.view.visible = false;

    if (!ArrowHold.tailGraphicsContext) {
      ArrowHold.tailGraphicsContext = new GraphicsContext()
        .lineTo(bodyWidth / 2, -bodyWidth / 2)
        .lineTo(bodyWidth, 0)
        .fill("white");
    }

    const tail = new Graphics(ArrowHold.tailGraphicsContext);
    tail.tint = game.laneColors[holdData.column].hold;
    this.view.addChild(tail);

    this.head = ArrowTap.getArrowSprite(game, holdData.column);
    this.head.x = (this.game.scaledColumnWidth * 0.6) / 2;
    this.head.tint = game.laneColors[holdData.column].holdHead;
    this.view.addChild(this.head);

    this.setViewHeight();
    this.game.notesContainer.addChild(this.view);
  }
}
