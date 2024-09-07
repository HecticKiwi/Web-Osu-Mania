import { Container, Graphics, GraphicsContext } from "pixi.js";
import { Game } from "../../game";
import { Tap } from "../tap";

export abstract class Key {
  static bottomContainerBgGraphicsContext: GraphicsContext | null;
  static markerGraphicsContext: GraphicsContext | null;
  static hitAreaGraphicsContext: GraphicsContext | null;

  public game: Game;

  protected columnId: number;

  public view: Container;
  protected hitArea: Graphics;
  protected bottomContainer: Container;
  protected marker: Container;

  protected setKeyGraphics() {}

  constructor(game: Game, columnId: number) {
    this.game = game;
    this.columnId = columnId;

    this.view = new Container();
    this.view.eventMode = "passive";

    this.setKeyGraphics();

    if (!Key.hitAreaGraphicsContext) {
      Key.hitAreaGraphicsContext = new GraphicsContext()
        .rect(0, 0, game.scaledColumnWidth, this.game.app.screen.height)
        .fill(0x000000);
    }

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
      // this.marker.tint = colors[this.game.laneColors[this.columnId]];
      this.marker.alpha = 0.5;
    } else {
      // this.marker.tint = "hsl(0,0%,30%)";
      this.marker.alpha = 0.0;
    }
  }

  private playNextHitsounds() {
    const nextTapNote = this.game.columns[this.columnId].find(
      (hitObject): hitObject is Tap => hitObject.data.type === "tap",
    );

    nextTapNote?.playHitsounds();
  }
}
