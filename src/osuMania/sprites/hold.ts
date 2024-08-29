import { HoldData } from "@/lib/beatmapParser";
import { scaleEntityWidth } from "@/lib/utils";
import { Container, Sprite } from "pixi.js";
import { SCROLL_SPEED_MULT, SKIN_DIR } from "../constants";
import { Game } from "../game";

export class Hold {
  public data: HoldData;

  protected game: Game;

  public view: Container;
  public shouldRemove: boolean;

  constructor(game: Game, holdData: HoldData) {
    this.game = game;
    this.data = holdData;

    const tail = Sprite.from(
      `${SKIN_DIR}/${game.skinManiaIni[`NoteImage${holdData.column}T`]}.png`,
    );
    scaleEntityWidth(tail, this.game.scaledColumnWidth);
    tail.zIndex = 1;
    tail.anchor.set(1, 0.5);

    tail.angle = 180;

    const body = Sprite.from(
      `${SKIN_DIR}/${game.skinManiaIni[`NoteImage${holdData.column}L`]}.png`,
    );
    scaleEntityWidth(body, this.game.scaledColumnWidth);

    const holdHeight =
      ((holdData.endTime - this.data.time) *
        this.game.settings.scrollSpeed *
        SCROLL_SPEED_MULT) /
      this.game.settings.mods.playbackRate;
    body.height = holdHeight;

    this.view = new Container();
    this.view.addChild(tail);
    this.view.addChild(body);
    this.view.width;
    this.view.x = holdData.column * this.game.scaledColumnWidth;

    this.game.notesContainer.addChild(this.view);
  }

  public update() {
    this.view.y =
      ((this.game.timeElapsed - this.data.endTime) *
        this.game.settings.scrollSpeed *
        SCROLL_SPEED_MULT) /
        this.game.settings.mods.playbackRate +
      this.game.hitPosition;

    const column = this.game.columns[this.data.column];

    if (column[0] !== this) {
      return;
    }

    const delta = this.data.endTime - this.game.timeElapsed;

    const absDelta = Math.abs(delta);

    if (this.game.settings.mods.autoplay) {
      if (this.game.timeElapsed > this.data.time) {
        this.game.keys[this.data.column].setPressed(true);
        this.game.stageLights[this.data.column].sprite.alpha = 1;
      }

      if (delta < 0) {
        this.game.scoreSystem.hit(320);

        this.game.hitError?.addTimingMark(0);

        this.game.keys[this.data.column].setPressed(false);
        this.game.stageLights[this.data.column].light();

        this.shouldRemove = true;
      }

      return;
    }

    // If this has passed the late miss point
    if (delta < -this.game.hitWindows[0]) {
      this.game.scoreSystem.hit(0);
      this.shouldRemove = true;
    }

    if (this.isHit()) {
      // Return if you pressed way too early...
      if (absDelta > this.game.hitWindows[0]) {
        return;
      }

      if (absDelta <= this.game.hitWindows[320]) {
        this.game.scoreSystem.hit(320);
      } else if (absDelta < this.game.hitWindows[300]) {
        this.game.scoreSystem.hit(300);
      } else if (absDelta < this.game.hitWindows[200]) {
        this.game.scoreSystem.hit(200);
      } else if (absDelta < this.game.hitWindows[100]) {
        this.game.scoreSystem.hit(100);
      } else if (absDelta < this.game.hitWindows[50]) {
        this.game.scoreSystem.hit(50);
      } else {
        this.game.scoreSystem.hit(0);
      }

      this.game.hitError?.addTimingMark(delta);

      this.shouldRemove = true;
    }
  }

  public isHit() {
    return this.game.inputSystem.releasedColumns[this.data.column];
  }
}
