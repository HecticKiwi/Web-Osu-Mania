import { HitObject as HitObjectData } from "@/lib/beatmapParser";
import { config, SKIN_DIR } from "../constants";
import { Game } from "../game";
import { HitObject } from "./hitObject";
import { Sprite } from "pixi.js";

export class Tap extends HitObject {
  constructor(game: Game, hitObjectData: HitObjectData, src?: string) {
    super(
      game,
      src ??
        `${SKIN_DIR}/${game.skinManiaIni[`NoteImage${hitObjectData.column}`]}.png`,
      hitObjectData,
    );

    this.sprite.zIndex = 1;
    this.sprite.anchor.set(undefined, 1);
    this.scaleToWidth(config.columnWidth);

    this.sprite.x = hitObjectData.column * config.columnWidth;
    this.game.notesContainer.addChild(this.sprite);
  }

  public isHit() {
    return this.game.inputSystem.tappedKeys.has(
      this.game.beatmapConfig.columnKeys[this.data.column],
    );
  }

  public hitFeedback() {
    this.game.hitSound.play();
    this.game.stageLights[this.data.column].light();

    this.game.keys[this.data.column].setPressed(true);
    setTimeout(() => this.game.keys[this.data.column].setPressed(false), 100);
  }

  public override update(dt: number) {
    super.update(dt);

    const column = this.game.columns[this.data.column];

    if (column[0] !== this) {
      return;
    }

    const delta = this.data.time - this.game.timeElapsed;
    const absDelta = Math.abs(delta);

    if (this.game.settings.autoplay) {
      if (delta < 0) {
        this.game.hit(320);

        this.game.hitError.addTimingMark(0);

        this.shouldRemove = true;

        this.hitFeedback();
      }

      return;
    }

    // If this has passed the late miss point
    if (delta < -this.game.hitWindows[0]) {
      this.game.hit(0);
      this.shouldRemove = true;
    }

    if (this.isHit()) {
      // Return if you pressed way too early...
      if (absDelta > this.game.hitWindows[0]) {
        return;
      }

      this.game.hitSound.play();

      if (absDelta <= this.game.hitWindows[320]) {
        this.game.hit(320);
      } else if (absDelta < this.game.hitWindows[300]) {
        this.game.hit(300);
      } else if (absDelta < this.game.hitWindows[200]) {
        this.game.hit(200);
      } else if (absDelta < this.game.hitWindows[100]) {
        this.game.hit(100);
      } else if (absDelta < this.game.hitWindows[50]) {
        this.game.hit(50);
      } else {
        this.game.hit(0);
      }

      this.game.hitError.addTimingMark(delta);

      this.shouldRemove = true;
    }
  }
}
