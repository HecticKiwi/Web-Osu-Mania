import { colors } from "@/osuMania/constants";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { Key } from "./key";

export class BarKey extends Key {
  protected override setKeyGraphics() {
    if (!Key.bottomContainerBgGraphicsContext) {
      const height = this.game.hitPositionOffset;
      Key.bottomContainerBgGraphicsContext = new GraphicsContext()
        .rect(0, 0, this.game.scaledColumnWidth, height)
        .fill("hsl(0,0%,10%)");
    }

    const markerSize = 40;

    if (!Key.markerGraphicsContext) {
      Key.markerGraphicsContext = new GraphicsContext()
        .roundRect(0, 0, markerSize, markerSize, 5)
        .fill("white");
    }

    this.bottomContainer = new Container();
    this.bottomContainer.pivot.y = this.game.hitPositionOffset;

    const bg = new Graphics(Key.bottomContainerBgGraphicsContext);
    this.bottomContainer.addChild(bg);

    this.marker = new Graphics(Key.markerGraphicsContext);
    this.marker.pivot = 5;
    this.marker.x = this.game.scaledColumnWidth / 2;
    this.marker.y = 40;

    this.marker.angle = 45;
    this.marker.tint = "hsl(0,0%,30%)";
    this.bottomContainer.addChild(this.marker);
  }

  public override setPressed(pressed: boolean) {
    if (pressed) {
      this.marker.tint = colors[this.game.laneColors[this.columnId]];
    } else {
      this.marker.tint = "hsl(0,0%,30%)";
    }
  }
}
