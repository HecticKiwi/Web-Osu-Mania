import { HoldBody } from "@/lib/beatmapParser";
import { config, SKIN_DIR } from "../constants";
import { Game } from "../game";
import { HitObject } from "./hitObject";

export class Hold extends HitObject {
  public data: HoldBody;

  constructor(game: Game, hitObjectData: HoldBody) {
    super(
      game,
      `${SKIN_DIR}/${game.skinManiaIni[`NoteImage${hitObjectData.column}L`]}.png`,
      hitObjectData,
    );

    this.scaleToWidth(config.columnWidth);
    const holdHeight =
      (hitObjectData.endTime - this.data.time) *
      this.game.settings.scrollSpeed *
      0.08;
    this.sprite.height = holdHeight;

    this.sprite.x = hitObjectData.column * config.columnWidth;
    this.game.notesContainer.addChild(this.sprite);

    this.sprite.anchor.set(undefined, 1);
  }

  public override update(dt: number) {
    super.update(dt);

    const column = this.game.columns[this.data.column];

    if (column[0] !== this) {
      return;
    }

    if (this.game.settings.autoplay) {
      this.game.stageLights[this.data.column].sprite.alpha = 1;
      this.game.keys[this.data.column].setPressed(true);
    }

    if (this.game.timeElapsed > this.data.endTime) {
      this.shouldRemove = true;

      if (this.game.settings.autoplay) {
        this.game.stageLights[this.data.column].light();
        this.game.keys[this.data.column].setPressed(false);
      }
    }
  }
}
