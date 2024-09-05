import { colors } from "@/osuMania/constants";
import { Graphics, GraphicsContext } from "pixi.js";
import { Key } from "./key";

export class BarKey extends Key {
  protected override setKeyGraphics() {
    if (!Key.bottomContainerGraphicsContext) {
      const height = this.game.app.screen.height - this.game.hitPosition;
      Key.bottomContainerGraphicsContext = new GraphicsContext()
        .rect(0, 0, this.game.scaledColumnWidth, height)
        .fill("hsl(0,0%,10%)");
    }

    const markerSize = 40;

    if (!Key.markerGraphicsContext) {
      Key.markerGraphicsContext = new GraphicsContext()
        .roundRect(0, 0, markerSize, markerSize, 5)
        .fill("white");
    }

    this.bottomContainer = new Graphics(Key.bottomContainerGraphicsContext);

    const height = this.game.app.screen.height - this.game.hitPosition;
    this.bottomContainer.pivot.y = height;

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
