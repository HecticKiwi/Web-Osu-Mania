import { BitmapText, Container, Graphics } from "pixi.js";
import { Game } from "../game";

const MAX_FRAMES = 30;

export class Fps {
  public game: Game;

  public view: Container;
  public text: BitmapText;

  private frameTimes: number[] = [];
  private frameTimeSum = 0;

  constructor(game: Game) {
    this.game = game;

    const width = 120;
    const height = 30;

    const background = new Graphics().rect(0, 0, width, height).fill(0x000000);
    background.alpha = 0.5;

    this.text = new BitmapText({
      text: "FPS:",
      style: {
        fill: 0xdddddd,
        fontFamily: "RobotoMono",
        fontSize: 20,
        fontWeight: "400",
      },
    });
    this.text.anchor.set(0, 0.5);
    this.text.x = 10;
    this.text.y = height / 2;

    this.view = new Container();
    this.view.addChild(background);
    this.view.addChild(this.text);
    this.view.interactiveChildren = false;
  }

  public update(fps: number) {
    this.frameTimes.push(fps);
    this.frameTimeSum += fps;

    if (this.frameTimes.length > MAX_FRAMES) {
      const removedFrame = this.frameTimes.shift()!;
      this.frameTimeSum -= removedFrame;
    }

    const averageFps = this.frameTimeSum / this.frameTimes.length;

    this.text.text = `FPS: ${Math.round(averageFps)}`;
  }
}
