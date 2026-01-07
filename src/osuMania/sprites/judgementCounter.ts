import { Judgement } from "@/types";
import { BitmapText, Container, FillInput, Graphics, TextStyle } from "pixi.js";
import { JUDGEMENTS } from "../constants";
import { Game } from "../game";

type JudgementColors = {
  key: Judgement;
  display?: string;
  color: FillInput;
};

export class JudgementCounter {
  public game: Game;
  public view: Container;

  public countTexts: Record<Judgement, BitmapText>;

  private readonly width = 120;
  private readonly rowHeight = 22;
  private readonly padding = 8;

  constructor(game: Game) {
    this.game = game;
    this.view = new Container();

    this.countTexts = {} as Record<Judgement, BitmapText>;

    this.createBackground();
    this.createRows();
  }

  private createBackground() {
    const height = JUDGEMENTS.length * this.rowHeight + this.padding * 2;

    const bg = new Graphics()
      .roundRect(0, 0, this.width, height, 6)
      .fill({ color: 0x000000, alpha: 0.5 });

    this.view.addChild(bg);
  }

  private createRows() {
    const styles = getComputedStyle(document.documentElement);
    const judgements: JudgementColors[] = [
      {
        key: 320,
        display: "300g",
        color: `hsl(${styles.getPropertyValue("--judgement-perfect")})`,
      },
      {
        key: 300,
        color: `hsl(${styles.getPropertyValue("--judgement-great")})`,
      },
      {
        key: 200,
        color: `hsl(${styles.getPropertyValue("--judgement-good")})`,
      },
      {
        key: 100,
        color: `hsl(${styles.getPropertyValue("--judgement-ok")})`,
      },
      {
        key: 50,
        color: `hsl(${styles.getPropertyValue("--judgement-meh")})`,
      },
      {
        key: 0,
        color: `hsl(${styles.getPropertyValue("--judgement-miss")})`,
      },
    ];

    const countStyle = new TextStyle({
      fontFamily: "RobotoMono",
      fontSize: 15,
      fill: 0xffffff,
    });

    judgements.forEach((judgement, i) => {
      const y = this.padding + i * this.rowHeight;

      // Left: judgement label
      const labelStyle = new TextStyle({
        fontFamily: "RobotoMono",
        fontSize: 15,
        fill: judgement.color,
      });

      const label = new BitmapText({
        text: judgement.display ?? judgement.key,
        style: labelStyle,
      });

      label.position.set(this.padding, y);
      this.view.addChild(label);

      // Right: count
      const count = new BitmapText({
        text: "0",
        style: countStyle,
      });

      count.anchor.set(1, 0); // Right align
      count.position.set(this.width - this.padding, y);

      this.view.addChild(count);
      this.countTexts[judgement.key] = count;
    });
  }

  public resize() {
    this.view.pivot.x = this.width / 2;

    if (this.game.settings.ui.judgementCounter === "left") {
      this.view.x =
        this.game.app.screen.width / 2 -
        this.game.stageContainer.width / 2 -
        this.width / 2 -
        20;
    } else {
      this.view.x =
        this.game.app.screen.width / 2 +
        this.game.stageContainer.width / 2 +
        this.width / 2 +
        20;
    }

    if (this.game.settings.upscroll) {
      this.view.y = 150;
    } else {
      this.view.pivot.y = this.view.height;
      this.view.y = this.game.app.screen.height - 150;
    }
  }
}
