import { gsap } from "gsap";
import { BitmapText, Container, Graphics } from "pixi.js";
import { Game } from "../game";

// Used for intro countdown and unpause countdown
// Time values are in milliseconds
export class Countdown {
  private game: Game;

  public view: Container;

  public text: BitmapText;
  public skipText: BitmapText;

  private progressBar: Container;
  private progressBarContainer: Container;

  private fullWidth = 300;

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
    this.view.x = this.game.app.screen.width / 2;
    this.view.y = this.game.app.screen.height / 2;
    this.view.alpha = 0;
  }

  public update(remainingTime: number, maxTime: number) {
    // Fade out at 0.5s left
    if (remainingTime < 500 && !gsap.isTweening(this.view)) {
      gsap.to(this.view, {
        pixi: {
          alpha: 0,
        },
        duration: 0.5,
        onComplete: () => {
          this.view.visible = false;
        },
      });
    }

    // Hide skip when under 2 seconds left
    const canSkip = this.game.timeElapsed < this.game.startTime - 2000;
    if (!canSkip) {
      this.skipText.alpha = 0;
    }

    // Skip intro
    if (canSkip && this.game.inputSystem.anyKeyTapped()) {
      this.game.song.seek(this.game.startTime / 1000 - 1);
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
}
