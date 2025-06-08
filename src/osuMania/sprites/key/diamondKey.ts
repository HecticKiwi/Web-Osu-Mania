import { diamondColumnRatio } from "@/osuMania/constants";
import { Container, Graphics, GraphicsContext } from "pixi.js";
import { Key } from "./key";

export class DiamondKey extends Key {
  static bottomContainerBgGraphicsContext: GraphicsContext | null;
  static markerGraphicsContext: GraphicsContext | null;

  protected marker: Graphics;
  protected bottomContainer: Container;

  protected override setKeyGraphics() {
    const width = this.game.scaledColumnWidth * diamondColumnRatio;
    const height = this.game.scaledColumnWidth * diamondColumnRatio;

    const rectangleWidth = width / Math.sqrt(2);
    const rectangleHeight = height / Math.sqrt(2);

    const cornerRadius = 8;

    if (!DiamondKey.bottomContainerBgGraphicsContext) {
      DiamondKey.bottomContainerBgGraphicsContext = new GraphicsContext()
        .roundRect(
          -rectangleWidth / 2,
          -rectangleHeight / 2,
          rectangleWidth,
          rectangleHeight,
          cornerRadius,
        )
        .stroke({
          width: 4,
          color: "hsl(0,0%,70%)",
        });
    }

    if (!DiamondKey.markerGraphicsContext) {
      DiamondKey.markerGraphicsContext = new GraphicsContext()
        .roundRect(
          -rectangleWidth / 2,
          -rectangleHeight / 2,
          rectangleWidth,
          rectangleHeight,
          cornerRadius,
        )
        .fill("white");
    }

    const diamond = new Graphics(DiamondKey.bottomContainerBgGraphicsContext);
    diamond.angle = 45;

    const bg = new Container();
    bg.x = this.game.scaledColumnWidth / 2;
    bg.addChild(diamond);
    bg.y = bg.height / 2;

    this.marker = new Graphics(DiamondKey.markerGraphicsContext);
    this.marker.angle = 45;
    this.marker.alpha = 0;
    bg.addChild(this.marker);

    this.bottomContainer = new Container();
    this.bottomContainer.addChild(bg);
    this.bottomContainer.pivot.y =
      this.game.hitPositionOffset + this.bottomContainer.height / 2;

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
