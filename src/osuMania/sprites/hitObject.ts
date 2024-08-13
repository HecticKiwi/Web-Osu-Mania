import { HitObject as HitObjectData, TYPE } from "@/lib/beatmapParser";
import { TEXTURES, config } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";

export const textures = {
  [TYPE.TAP]: TEXTURES.NOTE,
  [TYPE.HOLD_BODY]: TEXTURES.LN1,
  [TYPE.HOLD_TAIL]: TEXTURES.T1,
};

export class HitObject extends Entity {
  public data: HitObjectData;

  constructor(game: Game, src: string, hitObjectData: HitObjectData) {
    super(game, src);

    this.data = hitObjectData;
  }

  public update(dt?: number) {
    this.sprite.y =
      (this.game.timeElapsed - this.data.time) *
        this.game.settings.scrollSpeed *
        0.08 +
      config.hitPosition;
  }

  protected destroy() {
    this.sprite.parent.removeChild(this.sprite);
    this.game.columns[this.data.column].shift();
  }
}
