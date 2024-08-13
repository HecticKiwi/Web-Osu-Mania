import { HitObject as HitObjectData, HoldTail } from "@/lib/beatmapParser";
import { config, SKIN_DIR } from "../constants";
import { Game } from "../game";
import { Tap } from "./tap";

export class Tail extends Tap {
  public data: HoldTail;

  constructor(game: Game, hitObjectData: HitObjectData) {
    super(
      game,
      hitObjectData,
      `${SKIN_DIR}/${game.skinManiaIni[`NoteImage${hitObjectData.column}T`]}.png`,
    );

    this.sprite.anchor.set(1, 1);
    this.sprite.angle = 180;
  }

  public override isHit() {
    return this.game.inputSystem.releasedKeys.has(
      config.columnKeys[this.data.column],
    );
  }

  public override hitFeedback() {}
}
