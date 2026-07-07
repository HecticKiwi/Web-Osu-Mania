import { clamp } from "@/lib/math";
import { BitmapText, Container, Graphics } from "pixi.js";
import type { Game } from "../game";

// Used for intro countdown, unpause countdown, and break countdown
// Time values are in milliseconds
export class Countdown {
  private game: Game;

  public view: Container;

  public text: BitmapText;
  public skipText: BitmapText;

  private progressBar: Container;
  private progressBarContainer: Container;

  private fullWidth = 300;

  public break: {
    startTime: number;
    endTime: number;
  } | null;

  constructor(game: Game) {
    this.game = game;

    const remainingTime = this.game.startTime - this.game.timeElapsed;
    this.text = new BitmapText({
      text: Math.round(remainingTime / 1000),
      style: {
        fill: 0xdddddd,
        fontFamily: "RobotoMono",
        fontSize: 30,
        fontWeight: "700",
      },
    });
    this.text.anchor.set(0.5);
    this.text.x = this.fullWidth / 2;

    const progressBarBg = new Graphics()
      .rect(0, 0, this.fullWidth, 5)
      .fill(0xffffff);
    progressBarBg.alpha = 0.1;

    this.progressBar = new Graphics()
      .rect(0, 0, this.fullWidth, 5)
      .fill(0x71acef);
    this.progressBar.x = this.fullWidth / 2 - this.progressBar.width / 2;

    this.progressBarContainer = new Container();
    this.progressBarContainer.addChild(progressBarBg);
    this.progressBarContainer.addChild(this.progressBar);
    this.progressBarContainer.pivot.set(0.5, 0);
    this.progressBarContainer.y = 40;

    this.skipText = new BitmapText({
      text: "Press any key to Skip",
      style: {
        fill: 0x7d7d7d,
        fontFamily: "RobotoMono",
        fontSize: 20,
        fontWeight: "700",
      },
    });
    this.skipText.anchor.set(0.5, 0);
    this.skipText.x = this.fullWidth / 2;
    this.skipText.y = 60;

    this.view = new Container();
    this.view.addChild(this.text);
    this.view.addChild(this.progressBarContainer);
    this.view.addChild(this.skipText);
    this.view.pivot.set(this.view.width / 2, this.view.height / 2);

    this.view.x =
      this.game.app.screen.width / 2 + this.game.stagePositionOffset;
    this.view.y = this.game.app.screen.height / 2;
    this.view.alpha = 0;
  }

  public update(remainingTime: number, maxTime: number) {
    // Linearly fade from 500ms to 0ms remaining
    this.view.alpha = clamp(remainingTime / 500, 0, 1);

    // Hide skip when under 2 seconds left
    const canSkip = this.game.timeElapsed < this.game.startTime - 2000;
    if (!canSkip) {
      this.skipText.alpha = 0;
    }

    // Show tenths of seconds when under 3s left
    if (remainingTime < 3000) {
      this.text.text = (remainingTime / 1000).toFixed(1);
    } else {
      this.text.text = Math.round(remainingTime / 1000);
    }

    this.progressBar.width = Math.max(
      (remainingTime / maxTime) * this.fullWidth,
      0,
    );
    this.progressBar.x = this.fullWidth / 2 - this.progressBar.width / 2;
  }

  public updateBreak() {
    if (!this.break) {
      return;
    }

    const remainingTime = this.break.endTime - this.game.timeElapsed;

    if (remainingTime <= 0) {
      this.break = null;
      return;
    }

    const maxTime = this.break.endTime - this.break.startTime;
    this.update(remainingTime, maxTime);
  }

  public startBreakIfNeeded(timeElapsedOverride?: number) {
    const timeElapsed = timeElapsedOverride ?? this.game.timeElapsed;

    const nextHitObjectTime = Math.min(
      ...this.game.columns.map((_, i) => {
        return this.game.getNextHitObject(i)?.data.time ?? Infinity;
      }),
    );

    if (!Number.isFinite(nextHitObjectTime)) {
      return;
    }

    const timeUntilNextHitObject = nextHitObjectTime - timeElapsed;

    if (timeUntilNextHitObject >= this.game.settings.breakMinDuration) {
      this.break = {
        startTime: timeElapsed,
        endTime: nextHitObjectTime,
      };
    }
  }
}
