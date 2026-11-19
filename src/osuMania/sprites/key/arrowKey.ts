import { Container } from "pixi.js";
import { ArrowTap } from "../tap/arrowTap";
import { Key } from "./key";

export class ArrowKey extends Key {
  protected marker: Container;

  protected override setKeyGraphics() {
    const keyGraphics = ArrowTap.getKeyGraphics(this.game, this.columnId);
    this.marker = ArrowTap.getKeyGraphics(this.game, this.columnId, true);
    this.marker.alpha = 0;

    const container = new Container();
    container.addChild(keyGraphics);
    container.addChild(this.marker);
    container.x = this.game.scaledColumnWidth / 2;
    container.y = -this.game.hitPositionOffset;

    if (this.game.settings.upscroll) {
      container.scale.y = -container.scale.y;
    }

    this.view.addChild(container);

    this.view.zIndex = -3;
  }

  public override setPressed(pressed: boolean) {
    if (!this.game.settings.ui.receptorLighting) {
      return;
    }

    if (pressed) {
      this.marker.alpha = 0.7;
    } else {
      this.marker.alpha = 0.0;
    }
  }
}
