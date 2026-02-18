import { clamp } from "@/lib/math";
import { gsap } from "gsap";
import { Container, Graphics, Pool, Sprite, Texture } from "pixi.js";
import type { Game } from "../game";

const lightBlue = 0x99eeff;
const blue = 0x32bce7;
const green = 0x57e313;
const orange = 0xdaae46;

class MarkSprite extends Sprite {
  public static marksContainer: Container;

  public constructor() {
    super(Texture.WHITE);
    this.width = 2;
    this.height = 20;
    this.pivot.set(0.5, 0);
    this.visible = false;
    MarkSprite.marksContainer.addChild(this);
  }
}

export class ErrorBar {
  private game: Game;

  public view: Container;
  private background: Graphics;
  private foreground: Graphics;
  private averageMarker: Graphics;

  private readonly width = 300;
  private readonly height = 20;

  private xCount = 0;
  private xSum = 0;
  private quickX: gsap.QuickToFunc;

  private markPool: Pool<MarkSprite>;
  private marksContainer: Container;

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
    staticView.cacheAsTexture(true);

    this.marksContainer = new Container();

    this.view = new Container();
    this.view.interactiveChildren = false;
    this.view.addChild(staticView);
    this.view.addChild(this.marksContainer);
    this.view.addChild(centerLine);
    this.view.addChild(this.averageMarker);
    this.view.pivot.set(this.width / 2, this.height);
    this.view.scale.set(this.game.settings.errorBarScale);

    MarkSprite.marksContainer = this.marksContainer;
    this.markPool = new Pool(MarkSprite, 150);

    this.quickX = gsap.quickTo(this.averageMarker, "x", {
      duration: 0.5,
    });
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

    // 50 Section
    const orangeWidth = this.width;
    this.foreground
      .rect(0, height, orangeWidth, height)
      .rect(this.width - orangeWidth, height, orangeWidth, height)
      .fill(orange);

    // 200/100 Section
    const greenWidth =
      (this.game.hitWindows["100"] / this.game.hitWindows["50"]) * this.width;
    this.foreground
      .rect(center - greenWidth / 2, height, greenWidth, height)
      .fill(green);

    // 300 Section
    const blueWidth =
      (this.game.hitWindows["300"] / this.game.hitWindows["50"]) * this.width;
    this.foreground
      .rect(center - blueWidth / 2, height, blueWidth, height)
      .fill(blue);

    // 320 Section
    const lightBlueWidth =
      (this.game.hitWindows["320"] / this.game.hitWindows["50"]) * this.width;
    this.foreground
      .rect(center - lightBlueWidth / 2, height, lightBlueWidth, height)
      .fill(lightBlue);
  }

  public addTimingMark(offset: number) {
    const absOffset = Math.abs(offset);
    const color =
      absOffset <= this.game.hitWindows["320"]
        ? lightBlue
        : absOffset <= this.game.hitWindows["300"]
          ? blue
          : absOffset <= this.game.hitWindows["100"]
            ? green
            : orange;

    const mark = this.markPool.get();
    mark.tint = color;
    mark.alpha = 1;
    mark.visible = true;

    const x =
      (-offset / this.game.hitWindows["50"]) * (this.background.width / 2) +
      this.background.width / 2;
    mark.x = clamp(x, 0, this.width);

    this.xCount++;
    this.xSum += x;

    const hideMark = () => {
      mark.visible = false;
      mark.alpha = 0;
      this.markPool.return(mark);
      this.xCount--;
      this.xSum -= x;
    };

    if (this.game.settings.performanceMode) {
      setTimeout(hideMark, 1500);
    } else {
      gsap.to(mark, {
        pixi: {
          alpha: 0,
        },
        duration: 4,
        onComplete: hideMark,
      });
    }

    const averageX = this.xSum / this.xCount;

    if (this.game.settings.performanceMode) {
      this.averageMarker.x = averageX;
    } else {
      this.quickX(averageX);
    }
  }
}
