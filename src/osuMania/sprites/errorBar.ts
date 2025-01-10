import { clamp } from "@/lib/utils";
import { gsap } from "gsap";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Game } from "../game";

const blue = 0x32bce7;
const green = 0x57e313;
const orange = 0xdaae46;

export class ErrorBar {
  private game: Game;

  public view: Container;
  private background: Graphics;
  private foreground: Graphics;
  private timingMarks: Sprite[] = [];
  private averageMarker: Graphics;

  private readonly width = 300;
  private readonly height = 20;

  public constructor(game: Game) {
    this.game = game;

    this.background = new Graphics()
      .rect(0, 0, this.width, this.height)
      .fill(0x000000);
    this.background.alpha = 0.75;

    this.foreground = new Graphics();

    this.drawJudgementSections();

    const centerLine = new Graphics()
      .rect(this.width / 2, 0, 2, this.height)
      .fill(0xffffff);
    centerLine.pivot.set(1, 0);
    centerLine.zIndex = 1;

    this.averageMarker = new Graphics()
      .poly([0, 0, 5, 5, 10, 0], true)
      .fill(0xffffff);
    this.averageMarker.pivot.x = 5;
    this.averageMarker.x = this.width / 2;
    this.averageMarker.zIndex = 99;

    const staticView = new Container();
    staticView.addChild(this.background);
    staticView.addChild(this.foreground);
    staticView.addChild(centerLine);
    staticView.cacheAsTexture(true);

    this.view = new Container();
    this.view.interactiveChildren = false;
    this.view.addChild(staticView);
    this.view.addChild(this.averageMarker);
    this.view.pivot.set(this.width / 2, this.height);
    this.view.scale.set(this.game.settings.errorBarScale);
  }

  public resize() {
    this.view.width = Math.min(
      this.width * this.game.settings.errorBarScale,
      this.game.app.screen.width,
    );

    this.view.x = this.game.app.screen.width / 2;
    this.view.y = this.game.app.screen.height;
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

    const mark = Sprite.from(Texture.WHITE);
    mark.width = 2;
    mark.height = 20;
    mark.tint = color;
    mark.pivot.set(1, 0);

    const x =
      (-offset / this.game.hitWindows["50"]) * (this.background.width / 2) +
      this.background.width / 2;
    mark.x = clamp(x, 0, this.width);

    this.timingMarks.push(mark);
    this.view.addChild(mark);

    gsap.to(mark, {
      pixi: {
        alpha: 0,
      },
      duration: 4,
      onComplete: () => {
        this.view.removeChild(mark);
        this.timingMarks = this.timingMarks.filter((m) => m !== mark);
      },
    });

    const averageX =
      this.timingMarks.reduce((sum, mark) => sum + mark.x, 0) /
      this.timingMarks.length;

    gsap.to(this.averageMarker, {
      pixi: {
        x: averageX,
      },
      duration: 0.5,
      overwrite: true,
    });
  }
}
