import { circleColumnRatio } from "@/osuMania/constants";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { Key } from "./key";

export class CircleKey extends Key {
  static bottomContainerBgGraphicsContext: GraphicsContext | null;
  static markerGraphicsContext: GraphicsContext | null;

  protected marker: Graphics;
  protected bottomContainer: Container;

  protected override setKeyGraphics() {
    if (!CircleKey.bottomContainerBgGraphicsContext) {
      CircleKey.bottomContainerBgGraphicsContext =
        new GraphicsContext().roundRect(
          (this.game.scaledColumnWidth * (1 - circleColumnRatio)) / 2,
          0,
          this.game.scaledColumnWidth * circleColumnRatio,
          this.game.scaledColumnWidth * circleColumnRatio,
          this.game.scaledColumnWidth,
        );

      CircleKey.bottomContainerBgGraphicsContext.stroke({
        width: 4,
        color: "hsl(0,0%,70%)",
      });
    }

    const markerSize = this.game.scaledColumnWidth * circleColumnRatio;

    if (!CircleKey.markerGraphicsContext) {
      CircleKey.markerGraphicsContext = new GraphicsContext()
        .roundRect(0, 0, markerSize, markerSize, markerSize)
        .fill("white");
    }

    const bg = new Graphics(CircleKey.bottomContainerBgGraphicsContext);

    this.bottomContainer = new Container();
    this.bottomContainer.pivot.y = this.game.hitPositionOffset + markerSize / 2;
    this.bottomContainer.addChild(bg);

    this.marker = new Graphics(CircleKey.markerGraphicsContext);
    this.marker.pivot = 5;
    this.marker.pivot.x = markerSize / 2;
    this.marker.x = this.game.scaledColumnWidth / 2;
    this.marker.y = 4 + 1;

    this.marker.alpha = 0;
    this.bottomContainer.addChild(this.marker);

    this.view.addChild(this.bottomContainer);
  }

  public override setPressed(pressed: boolean) {
    if (pressed) {
      this.marker.alpha = 0.7;
    } else {
      this.marker.alpha = 0.0;
    }
  }
}
