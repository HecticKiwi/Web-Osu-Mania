import { gsap } from "gsap";
import { Container, Graphics, Text } from "pixi.js";
import { Game } from "../game";

export class Countdown {
  private game: Game;

  public view: Container;

  public text: Text;
  public skipText: Text;

  private progressBar: Container;
  private progressBarContainer: Container;

  private fullWidth = 400;

  constructor(game: Game) {
    this.game = game;

    this.view = new Container();

    const remainingTime = this.game.startTime - this.game.timeElapsed;
    this.text = new Text({
      text: Math.round(remainingTime / 1000),
      style: {
        fill: 0xdddddd,
        fontFamily: "RobotoMono",
        fontSize: 30,
        fontWeight: "700",
      },
    });
    this.text.anchor.set(0.5);
    this.text.x = 200;

    this.view.addChild(this.text);

    const progressBarBg = new Graphics()
      .rect(0, 0, this.fullWidth, 5)
      .fill(0xffffff);
    progressBarBg.alpha = 0.1;

    this.progressBar = new Graphics()
      .rect(0, 0, this.fullWidth, 5)
      .fill(0x71acef);
    this.progressBar.width = this.fullWidth;
    this.progressBar.x = this.fullWidth / 2 - this.progressBar.width / 2;

    this.progressBarContainer = new Container();
    this.progressBarContainer.addChild(progressBarBg);
    this.progressBarContainer.addChild(this.progressBar);

    this.progressBarContainer.pivot.set(0.5, 0);
    this.progressBarContainer.y = 40;

    this.view.addChild(this.progressBarContainer);

    this.skipText = new Text({
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
    this.view.addChild(this.skipText);

    this.view.pivot.set(this.view.width / 2, this.view.height / 2);
    this.view.x = this.game.app.screen.width / 2;
    this.view.y = this.game.app.screen.height / 2;
    this.view.alpha = 0;
  }

  public update() {
    const remainingTime = this.game.startTime - this.game.timeElapsed;

    if (remainingTime < 1000 && !gsap.isTweening(this.view)) {
      gsap.to(this.view, {
        pixi: {
          alpha: 0,
        },
        duration: 1,
        onComplete: () => {
          this.view.visible = false;
        },
      });
    }

    if (remainingTime < 2000) {
      this.skipText.alpha = 0;
    }

    // Skip intro
    if (
      remainingTime >= 2000 &&
      (this.game.inputSystem.tappedColumns.includes(true) ||
        (this.game.inputSystem.tappedKeys.size > 0 &&
          !this.game.inputSystem.tappedKeys.has("Escape")))
    ) {
      this.game.song.seek(this.game.startTime / 1000 - 1);
    }

    this.text.text = Math.round(remainingTime / 1000) + 1;

    this.progressBar.width = (remainingTime / this.game.startTime) * 400;
    this.progressBar.x = this.fullWidth / 2 - this.progressBar.width / 2;
  }
}
