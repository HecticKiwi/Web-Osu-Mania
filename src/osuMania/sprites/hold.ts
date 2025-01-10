import { HoldData } from "@/lib/beatmapParser";
import { gsap } from "gsap";
import { Container, Sprite, Texture } from "pixi.js";
import { colors } from "../constants";
import { Game } from "../game";
import { Tap } from "./tap";

export class Hold {
  public data: HoldData;

  protected game: Game;

  public view: Container;
  private body: Container;
  private head?: Container;

  public shouldRemove: boolean;
  private height: number;
  private broken = false;

  constructor(game: Game, holdData: HoldData) {
    this.game = game;
    this.data = holdData;

    this.body = Sprite.from(Texture.WHITE);

    if (this.game.settings.style === "circles") {
      this.body.width = this.game.scaledColumnWidth * 0.8;
    } else {
      this.body.width = this.game.scaledColumnWidth;
    }

    this.height = this.game.getHitObjectOffset(holdData.time, holdData.endTime);

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
      this.view.addChild(this.head);
    }

    this.setViewHeight();
    this.game.notesContainer.addChild(this.view);
  }

  public update() {
    this.view.visible = true;

    this.view.y =
      this.game.hitPosition -
      this.game.getHitObjectOffset(this.game.timeElapsed, this.data.endTime);

    const column = this.game.columns[this.data.column];
    if (column[0] !== this) {
      // Set height again in case of resize
      if (this.game.timeElapsed < this.data.time) {
        this.height = this.game.getHitObjectOffset(
          this.data.time,
          this.data.endTime,
        );
      }

      this.setViewHeight();

      return;
    }

    const endTimeDelta = this.data.endTime - this.game.timeElapsed;
    const absDelta = Math.abs(endTimeDelta);

    if (this.game.settings.mods.autoplay) {
      // Press key during hold
      if (this.game.timeElapsed > this.data.time) {
        this.game.keys[this.data.column].setPressed(true);

        if (this.game.stageLights[this.data.column]) {
          this.game.stageLights[this.data.column].view.alpha = 1;
        }
      }

      // If hold is completed
      if (endTimeDelta < 0) {
        this.game.scoreSystem.hit(320);

        this.game.errorBar?.addTimingMark(0);

        this.game.keys[this.data.column].setPressed(false);
        this.game.stageLights[this.data.column]?.light();

        this.shouldRemove = true;
      }
    } else {
      // If this has passed the late miss point
      if (endTimeDelta < -this.game.hitWindows[0]) {
        this.game.scoreSystem.hit(0);
        this.shouldRemove = true;
        return;
      }

      if (this.isHit() && absDelta < this.game.hitWindows[0]) {
        if (this.broken) {
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

        this.game.errorBar?.addTimingMark(endTimeDelta);
        this.shouldRemove = true;

        return;
      }

      // If released before hold was done
      if (
        !this.game.inputSystem.pressedColumns[this.data.column] &&
        !this.broken
      ) {
        this.broken = true;
        this.game.errorBar?.addTimingMark(endTimeDelta);

        gsap.to(this.view, {
          pixi: {
            brightness: 0.5,
          },
          duration: 0.3,
        });
      }
    }

    if (!this.broken) {
      if (this.game.timeElapsed >= this.data.time) {
        this.height = Math.max(
          this.game.getHitObjectOffset(
            this.game.timeElapsed,
            this.data.endTime,
          ),
          0,
        );
      }

      if (this.view.y > this.game.hitPosition) {
        this.view.y = this.game.hitPosition;
      }
    }

    this.setViewHeight();
  }

  public isHit() {
    return this.game.inputSystem.releasedColumns[this.data.column];
  }

  private setViewHeight() {
    this.body.height = this.height;

    if (this.head) {
      this.head.y = this.height;
    }
  }
}
