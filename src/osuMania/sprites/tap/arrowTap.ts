import { TapData } from "@/lib/beatmapParser";
import { BASE_PATH } from "@/lib/utils";
import { arrowColumnRatio } from "@/osuMania/constants";
import { Game } from "@/osuMania/game";
import { Container, Sprite, Texture } from "pixi.js";
import { Tap } from "./tap";

export class ArrowTap extends Tap {
  public static getArrowSprite(game: Game, column: number) {
    if (!Tap.renderTexture) {
      Tap.renderTexture = Texture.from(`${BASE_PATH}/skin/arrow.svg`);
    }

    const width = game.scaledColumnWidth * arrowColumnRatio;
    const height = game.scaledColumnWidth * arrowColumnRatio;

    const sprite = Sprite.from(Tap.renderTexture);
    sprite.width = width;
    sprite.height = height;
    sprite.zIndex = 1;
    sprite.anchor.set(0.5);

    sprite.angle = game.laneArrowDirections[column];

    const container = new Container();
    container.addChild(sprite);

    if (game.settings.upscroll) {
      container.scale.y = -container.scale.y;
    }

    return container;
  }

  constructor(game: Game, tapData: TapData) {
    super(game, tapData);

    if (!Tap.renderTexture) {
      Tap.renderTexture = Texture.from("${BASE_PATH}/skin/arrow.svg");
    }

    this.view = ArrowTap.getArrowSprite(game, tapData.column);
    this.view.x =
      tapData.column * game.scaledColumnWidth + game.scaledColumnWidth / 2;
    this.view.visible = false;

    if (this.data.isHoldHead) {
      this.view.tint = game.laneColors[tapData.column].holdHead;
    } else {
      this.view.tint = game.laneColors[tapData.column].tap;
    }
    this.view.tint = "green";

    this.game.notesContainer.addChild(this.view);
  }
}
