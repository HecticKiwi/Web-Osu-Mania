import type { TapData } from "@/lib/beatmapParser";
import type { Game } from "@/osuMania/game";
import { Sprite, Texture } from "pixi.js";
import { Tap } from "./tap";

export class BarTap extends Tap {
  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    const width = game.scaledColumnWidth;
    const height = width * 0.4;

    this.view = Sprite.from(Texture.WHITE);
    this.view.width = width;
    this.view.height = height;
    this.view.zIndex = 1;
    this.view.pivot.x = width / 2 / this.view.scale.x;
    this.view.pivot.y = height / this.view.scale.y;
    this.view.x =
      tapData.column * game.scaledColumnWidth + game.scaledColumnWidth / 2;
    this.view.visible = false;

    if (this.data.isHoldHead) {
      this.view.tint = game.laneColors[tapData.column].holdHead;
    } else {
      this.view.tint = game.laneColors[tapData.column].tap;
    }

    this.game.notesContainer.addChild(this.view);
  }
}
