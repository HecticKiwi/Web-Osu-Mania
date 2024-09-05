import { Graphics, GraphicsContext } from "pixi.js";
import { Key } from "./key";

export class CircleKey extends Key {
  protected override setKeyGraphics() {
    if (!Key.bottomContainerGraphicsContext) {
      Key.bottomContainerGraphicsContext = new GraphicsContext().roundRect(
        this.game.scaledColumnWidth * 0.1,
        0,
        this.game.scaledColumnWidth * 0.8,
        this.game.scaledColumnWidth * 0.8,
        this.game.scaledColumnWidth,
      );

      Key.bottomContainerGraphicsContext.stroke({
        width: 4,
        color: "hsl(0,0%,70%)",
      });
    }

    const markerSize = this.game.scaledColumnWidth * 0.8;

    if (!Key.markerGraphicsContext) {
      Key.markerGraphicsContext = new GraphicsContext()
        .roundRect(0, 0, markerSize, markerSize, markerSize)
        .fill("white");
    }

    this.bottomContainer = new Graphics(Key.bottomContainerGraphicsContext);
    this.bottomContainer.pivot.y = this.game.hitPositionOffset + markerSize / 2;

    this.marker = new Graphics(Key.markerGraphicsContext);
    this.marker.pivot = 5;
    this.marker.pivot.x = markerSize / 2;
    this.marker.x = this.game.scaledColumnWidth / 2;
    this.marker.y = 4 + 1;

    this.marker.alpha = 0;
    this.bottomContainer.addChild(this.marker);

    this.view.zIndex = -3;
  }

  public override setPressed(pressed: boolean) {
    if (pressed) {
      this.marker.alpha = 0.7;
    } else {
      this.marker.alpha = 0.0;
    }
  }
}
