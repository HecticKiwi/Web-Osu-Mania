import { HoldData } from "@/lib/beatmapParser";
import { gsap } from "gsap";
import { Container } from "pixi.js";
import { Game } from "../../game";

// https://osu.ppy.sh/wiki/en/Gameplay/Judgement/osu%21mania#scorev2
export abstract class Hold {
  public data: HoldData;

  protected game: Game;

  public view: Container;
  protected body: Container;
  protected head?: Container;

  public shouldRemove: boolean;
  protected height: number;
  protected broken = false;

  constructor(game: Game, holdData: HoldData) {
    this.game = game;
    this.data = holdData;
    this.height = this.game.getHitObjectOffset(holdData.time, holdData.endTime);
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

  public hit() {}

  public release() {
    const endTimeDelta = this.data.endTime - this.game.timeElapsed;
    const absDelta = Math.abs(endTimeDelta);

    if (absDelta < this.game.hitWindows[0] * 1.5) {
      this.shouldRemove = true;

      if (this.broken) {
        this.game.scoreSystem.hit(50);
        return;
      }

      if (absDelta <= this.game.hitWindows[320] * 1.5) {
        this.game.scoreSystem.hit(320);
      } else if (absDelta <= this.game.hitWindows[300] * 1.5) {
        this.game.scoreSystem.hit(300);
      } else if (absDelta <= this.game.hitWindows[200] * 1.5) {
        this.game.scoreSystem.hit(200);
      } else if (absDelta <= this.game.hitWindows[100] * 1.5) {
        this.game.scoreSystem.hit(100);
      } else if (absDelta <= this.game.hitWindows[50] * 1.5) {
        this.game.scoreSystem.hit(50);
      } else {
        this.game.scoreSystem.hit(0);
      }

      this.game.errorBar?.addTimingMark(endTimeDelta / 1.5);

      return;
    }

    // If released before hold was done
    if (!this.broken) {
      this.broken = true;

      gsap.to(this.view, {
        pixi: {
          brightness: 0.5,
        },
        duration: 0.3,
      });
    }
  }

  protected setViewHeight() {
    this.body.height = this.height;

    if (this.head) {
      this.head.y = this.height;
    }
  }
}
