import { Container, Graphics, GraphicsContext, Sprite, Texture } from "pixi.js";
import { Key } from "./key";

export class BarKey extends Key {
  static markerGraphicsContext: GraphicsContext | null;

  protected marker: Graphics;
  protected bottomContainer: Container;

  protected override setKeyGraphics() {
    const markerSize = 40;

    if (!BarKey.markerGraphicsContext) {
      BarKey.markerGraphicsContext = new GraphicsContext()
        .roundRect(0, 0, markerSize, markerSize, 5)
        .fill("white");
    }

    this.bottomContainer = new Container();
    this.bottomContainer.pivot.y = this.game.hitPositionOffset;

    const bg = Sprite.from(Texture.WHITE);
    bg.width = this.game.scaledColumnWidth;
    bg.height = this.game.hitPositionOffset;
    bg.tint = "hsl(0,0%,10%)";

    this.bottomContainer.addChild(bg);

    this.marker = new Graphics(BarKey.markerGraphicsContext);
    this.marker.pivot = 5;
    this.marker.x = this.game.scaledColumnWidth / 2;
    this.marker.y = 40;

    this.marker.angle = 45;
    this.marker.tint = "hsl(0,0%,30%)";
    this.bottomContainer.addChild(this.marker);
    this.view.addChild(this.bottomContainer);
  }

  public override setPressed(pressed: boolean) {
    if (pressed) {
      this.marker.tint = this.game.laneColors[this.columnId];
    } else {
      this.marker.tint = "hsl(0,0%,30%)";
    }
  }
}
