import { arrowColumnRatio } from "@/osuMania/constants";
import { Container, Sprite } from "pixi.js";
import { Key } from "./key";

export class ArrowKey extends Key {
  protected marker: Sprite;

  protected override setKeyGraphics() {
    const width = this.game.scaledColumnWidth * arrowColumnRatio;
    const height = this.game.scaledColumnWidth * arrowColumnRatio;

    const bg = Sprite.from("/skin/arrowOutline.svg");
    bg.anchor.set(0.5);
    bg.width = width;
    bg.height = height;
    bg.angle = this.game.laneArrowDirections[this.columnId];

    this.marker = Sprite.from("/skin/arrow.svg");
    this.marker.anchor.set(0.5);
    this.marker.angle = this.game.laneArrowDirections[this.columnId];
    this.marker.width = width;
    this.marker.height = height;
    this.marker.alpha = 0;

    const bottomContainer = new Container();
    bottomContainer.addChild(bg);
    bottomContainer.addChild(this.marker);
    bottomContainer.x = this.game.scaledColumnWidth / 2;
    bottomContainer.y = -this.game.hitPositionOffset;

    if (this.game.settings.upscroll) {
      bottomContainer.scale.y = -bottomContainer.scale.y;
    }

    this.view.addChild(bottomContainer);

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
