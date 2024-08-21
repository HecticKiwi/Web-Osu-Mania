import { clamp } from "@/lib/utils";
import { gsap } from "gsap";
import { Container, Graphics } from "pixi.js";
import { Game } from "../game";

const blue = 0x32bce7;
const green = 0x57e313;
const orange = 0xdaae46;

export class ErrorBar {
  private game: Game;
  public container: Container;
  private background: Graphics;
  private foreground: Graphics;
  private timingMarks: Graphics[] = [];

  private readonly width = 300;
  private readonly height = 20;

  public constructor(game: Game) {
    this.game = game;

    this.container = new Container();
    this.container.pivot.set(this.width / 2, this.height);
    this.container.scale.set(2);

    this.background = new Graphics()
      .rect(0, 0, this.width, this.height)
      .fill(0x000000);
    this.background.alpha = 0.75;
    this.container.addChild(this.background);

    this.foreground = new Graphics();
    this.container.addChild(this.foreground);

    this.drawJudgementSections();

    const centerLine = new Graphics()
      .rect(this.width / 2, 0, 2, this.height)
      .fill(0xffffff);
    centerLine.pivot.set(1, 0);
    centerLine.zIndex = 1;
    this.container.addChild(centerLine);
  }

  private drawJudgementSections() {
    const center = this.width / 2;
    const height = this.height / 3;

    // 300 Section
    const blueWidth =
      (this.game.hitWindows["300"] / this.game.hitWindows["50"]) * this.width;
    this.foreground
      .rect(center - blueWidth / 2, height, blueWidth, height)
      .fill(blue);

    // 200/100 Section
    const greenWidth =
      ((this.game.hitWindows["200"] - this.game.hitWindows["300"]) /
        this.game.hitWindows["50"]) *
      this.width;
    this.foreground
      .rect(center - blueWidth / 2 - greenWidth, height, greenWidth, height)
      .rect(center + blueWidth / 2, height, greenWidth, height)
      .fill(green);

    // 50 Section
    const orangeWidth = (this.width - blueWidth - 2 * greenWidth) / 2;
    this.foreground
      .rect(0, height, orangeWidth, height)
      .rect(this.width - orangeWidth, height, orangeWidth, height)
      .fill(orange);
  }

  public addTimingMark(offset: number) {
    const absOffset = Math.abs(offset);
    const color =
      absOffset <= this.game.hitWindows["300"]
        ? blue
        : absOffset < this.game.hitWindows["100"]
          ? green
          : orange;
    const mark = new Graphics().rect(0, 0, 2, 20).fill(color);

    const x =
      (-offset / this.game.hitWindows["50"]) * (this.background.width / 2) +
      this.background.width / 2;
    mark.pivot.set(1, 0);
    mark.x = clamp(x, 0, this.width);

    this.timingMarks.push(mark);
    this.container.addChild(mark);

    gsap.to(mark, {
      pixi: {
        alpha: 0,
      },
      duration: 4,
      onComplete: () => {
        this.container.removeChild(mark);
        this.timingMarks = this.timingMarks.filter((m) => m !== mark);
      },
    });
  }
}
