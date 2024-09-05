import { Container, Graphics, GraphicsContext } from "pixi.js";
import { colors } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";
import { Tap } from "./tap";

export class Key extends Entity {
  static bottomContainerGraphicsContext: GraphicsContext | null;
  static markerGraphicsContext: GraphicsContext | null;
  static hitAreaGraphicsContext: GraphicsContext | null;

  private columnId: number;

  public view: Container;
  private hitArea: Graphics;
  private bottomContainer: Container;
  private marker: Container;

  constructor(game: Game, columnId: number) {
    super(game);

    this.columnId = columnId;

    this.view = new Container();
    this.view.eventMode = "passive";

    const height = game.app.screen.height - game.hitPosition;

    const markerSize = 40;

    if (!Key.bottomContainerGraphicsContext) {
      Key.bottomContainerGraphicsContext = new GraphicsContext()
        .rect(0, 0, game.scaledColumnWidth, height)
        .fill("hsl(0,0%,10%)");
    }

    if (!Key.markerGraphicsContext) {
      Key.markerGraphicsContext = new GraphicsContext()
        .roundRect(0, 0, markerSize, markerSize, 5)
        .fill("white");
    }

    if (!Key.hitAreaGraphicsContext) {
      Key.hitAreaGraphicsContext = new GraphicsContext()
        .rect(0, 0, game.scaledColumnWidth, this.game.app.screen.height)
        .fill(0x000000);
    }

    this.bottomContainer = new Graphics(Key.bottomContainerGraphicsContext);
    this.bottomContainer.pivot.y = height;

    this.marker = new Graphics(Key.markerGraphicsContext);
    this.marker.pivot = 5;
    this.marker.x = game.scaledColumnWidth / 2;
    this.marker.y = 40;
    this.marker.angle = 45;
    this.marker.tint = "hsl(0,0%,30%)";
    this.bottomContainer.addChild(this.marker);

    this.view.eventMode = "static";

    this.view.addChild(this.bottomContainer);

    this.hitArea = new Graphics(Key.hitAreaGraphicsContext);
    this.hitArea.alpha = 0;
    this.hitArea.pivot.y = this.game.app.screen.height;
    this.hitArea.eventMode = "static";
    this.hitArea.cursor = "pointer";

    this.hitArea.on("pointerdown", () => {
      this.game.inputSystem.tappedColumns[this.columnId] = true;
      this.game.inputSystem.pressedColumns[this.columnId] = true;
    });

    this.hitArea.on("pointerup", () => {
      this.game.inputSystem.pressedColumns[this.columnId] = false;
      this.game.inputSystem.releasedColumns[this.columnId] = true;
    });

    this.hitArea.on("pointerupoutside", () => {
      this.game.inputSystem.pressedColumns[this.columnId] = false;
      this.game.inputSystem.releasedColumns[this.columnId] = true;
    });

    this.view.addChild(this.hitArea);
  }

  public update() {
    this.setPressed(this.game.inputSystem.pressedColumns[this.columnId]);

    if (this.game.inputSystem.tappedColumns[this.columnId]) {
      this.playNextHitsounds();
    }
  }

  public resize() {
    this.view.width = this.game.scaledColumnWidth;
    this.view.x =
      this.game.stageSideWidth + this.columnId * this.game.scaledColumnWidth;
    this.view.y = this.game.app.screen.height;
  }

  public setPressed(pressed: boolean) {
    if (pressed) {
      this.marker.tint = colors[this.game.laneColors[this.columnId]];
    } else {
      this.marker.tint = "hsl(0,0%,30%)";
    }
  }

  private playNextHitsounds() {
    const nextTapNote = this.game.columns[this.columnId].find(
      (hitObject): hitObject is Tap => hitObject.data.type === "tap",
    );

    nextTapNote?.playHitsounds();
  }
}
