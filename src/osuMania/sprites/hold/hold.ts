import type { HoldData } from "@/lib/beatmapParser";
import type { Judgement } from "@/types";
import { gsap } from "gsap";
import type { Container } from "pixi.js";
import type { Game } from "../../game";

// https://osu.ppy.sh/wiki/en/Gameplay/Judgement/osu%21mania#scorev2
export abstract class Hold {
  public data: HoldData;

  protected game: Game;

  public view: Container;
  protected body: Container;
  protected head?: Container;

  protected broken = false;

  constructor(game: Game, holdData: HoldData) {
    this.game = game;
    this.data = holdData;
  }

  public update() {
    this.view.visible = true;

    this.view.y =
      this.game.hitPosition +
      this.game.settings.noteOffset -
      this.game.getHitObjectOffset(
        this.game.timeElapsed,
        this.getVisualEndTime(),
      );

    const endTimeDelta = this.data.endTime - this.game.timeElapsed;

    // If this has passed the late miss point
    if (endTimeDelta < -this.game.hitWindows[0] * 1.5) {
      this.game.scoreSystem.hit(0, "late", true);
      this.game.timelineData.push({
        time: this.data.endTime + this.game.hitWindows[0],
        error: -this.game.hitWindows[0],
        judgement: 0,
        health: this.game.healthSystem.health,
      });

      this.game.currentColumnIndices[this.data.column]++;
      this.view.visible = false;
      return;
    }

    let height: number;
    if (!this.broken) {
      if (this.game.timeElapsed >= this.data.time) {
        height = Math.max(
          this.game.getHitObjectOffset(
            this.game.timeElapsed,
            this.getVisualEndTime(),
          ),
          0,
        );
      }

      if (this.view.y > this.game.hitPosition) {
        this.view.y = this.game.hitPosition;
      }
    }

    height ??= this.game.getHitObjectOffset(
      this.data.time,
      this.getVisualEndTime(),
    );

    this.setViewHeight(height);
  }

  public hit() {}

  public resetHeight() {
    this.view.visible = true;
    this.setViewHeight(
      this.game.getHitObjectOffset(this.data.time, this.getVisualEndTime()),
    );
  }

  public release(timeElapsedOverride?: number) {
    const timeElapsed = timeElapsedOverride ?? this.game.timeElapsed;
    const endTimeDelta = this.data.endTime - timeElapsed;
    const absDelta = Math.abs(endTimeDelta);

    const earlyOrLate = endTimeDelta > 0 ? "early" : "late";

    if (absDelta < this.game.hitWindows[0] * 1.5) {
      this.game.currentColumnIndices[this.data.column]++;

      let judgement: Judgement;
      if (this.broken) {
        judgement = 50;
      } else {
        judgement =
          absDelta <= this.game.hitWindows[320] * 1.5
            ? 320
            : absDelta <= this.game.hitWindows[300] * 1.5
              ? 300
              : absDelta <= this.game.hitWindows[200] * 1.5
                ? 200
                : absDelta <= this.game.hitWindows[100] * 1.5
                  ? 100
                  : absDelta <= this.game.hitWindows[50] * 1.5
                    ? 50
                    : 0;
      }

      this.game.scoreSystem.hitErrors.push({
        error: endTimeDelta,
        judgement,
      });
      this.game.scoreSystem.hit(judgement, earlyOrLate, true);
      this.game.timelineData.push({
        time: timeElapsed,
        error: endTimeDelta,
        judgement,
        health: this.game.healthSystem.health,
      });

      this.game.errorBar?.addTimingMark(endTimeDelta / 1.5);

      this.view.visible = false;

      return;
    }

    // If released before hold was done
    this.break();
  }

  public break() {
    if (!this.broken) {
      this.broken = true;

      this.game.scoreSystem.combo = 0;
      if (this.game.comboText) {
        this.game.comboText.text = 0;
        this.game.comboText.visible = false;
      }

      gsap.to(this.view, {
        pixi: {
          brightness: 0.5,
        },
        duration: this.game.settings.performanceMode ? 0 : 0.3,
      });
    }
  }

  protected setViewHeight(height: number) {
    this.body.height = height;

    if (this.head) {
      this.head.y = height;
    }
  }

  private getVisualEndTime() {
    if (this.game.mods.percy) {
      return Math.max(
        this.data.endTime - this.game.mods.percy.cutoffDuration,
        this.data.time,
      );
    }

    return Math.max(this.data.endTime, this.data.time);
  }
}
