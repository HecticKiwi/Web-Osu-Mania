import { HoldData } from "@/lib/beatmapParser";
import { gsap } from "gsap";
import { Container, Sprite, Texture } from "pixi.js";
import { colors, SCROLL_SPEED_MULT } from "../constants";
import { Game } from "../game";
import { Tap } from "./tap";

export class Hold {
  public data: HoldData;

  protected game: Game;

  public view: Container;
  private body: Container;
  private head: Container;

  public shouldRemove: boolean;
  private timeBroken: number | null = null;

  constructor(game: Game, holdData: HoldData) {
    this.game = game;
    this.data = holdData;

    this.body = Sprite.from(Texture.WHITE);

    this.body.width = this.game.scaledColumnWidth;

    if (this.game.settings.style === "circles") {
      this.body.width = this.game.scaledColumnWidth * 0.8;
    }

    const holdHeight =
      ((holdData.endTime - this.data.time) *
        this.game.settings.scrollSpeed *
        SCROLL_SPEED_MULT) /
      this.game.settings.mods.playbackRate;
    this.body.height = holdHeight;

    this.view = new Container();
    this.view.addChild(this.body);
    this.view.tint = colors[game.laneColors[holdData.column]];

    this.view.pivot.x = this.view.width / 2;
    this.view.x =
      holdData.column * this.game.scaledColumnWidth +
      this.game.scaledColumnWidth / 2;
    this.view.visible = false;

    if (this.game.settings.style === "circles") {
      const tail = new Sprite(Tap.renderTexture!);
      tail.pivot.y = tail.height / 2;
      this.view.addChild(tail);

      this.head = new Sprite(Tap.renderTexture!);
      this.head.pivot.y = tail.height / 2;
      this.head.y = holdHeight;
      this.view.addChild(this.head);
    }

    this.game.notesContainer.addChild(this.view);
  }

  public update() {
    this.view.visible = true;

    if (!this.timeBroken && this.game.timeElapsed >= this.data.time) {
      const newHeight = Math.max(
        ((this.data.endTime - this.game.timeElapsed) *
          this.game.settings.scrollSpeed *
          SCROLL_SPEED_MULT) /
          this.game.settings.mods.playbackRate,
        0,
      );
      this.body.height = newHeight;

      if (this.head) {
        this.head.y = newHeight;
      }
    }

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
        this.game.stageLights[this.data.column].view.alpha = 1;
      }

      if (delta < 0) {
        this.game.scoreSystem.hit(320);

        this.game.errorBar?.addTimingMark(0);

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
      // Return if you released way too early...
      if (absDelta > this.game.hitWindows[0]) {
        return;
      }

      if (this.timeBroken) {
        this.game.scoreSystem.hit(50);
        this.shouldRemove = true;

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

      this.game.errorBar?.addTimingMark(delta);
      this.shouldRemove = true;

      return;
    }

    // If released before hold was done
    if (
      !this.game.inputSystem.pressedColumns[this.data.column] &&
      !this.timeBroken
    ) {
      this.timeBroken = this.game.timeElapsed;
      this.game.errorBar?.addTimingMark(delta);

      gsap.to(this.view, {
        pixi: {
          brightness: 0.5,
        },
        duration: 0.3,
      });
    }
  }

  public isHit() {
    return this.game.inputSystem.releasedColumns[this.data.column];
  }
}
