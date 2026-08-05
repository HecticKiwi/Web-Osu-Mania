import { BitmapText, Container, Graphics, TextStyle } from "pixi.js";
import type { Game } from "../game";

export class KpsCounter {
  public game: Game;
  public view: Container;

  public timestamps: number[] = [];
  public total = 0;

  public kpsText: BitmapText;
  public totalText: BitmapText;

  private readonly width = 120;
  private readonly rowHeight = 22;
  private readonly padding = 8;

  constructor(game: Game) {
    this.game = game;
    this.view = new Container();

    this.createBackground();
    this.createRows();
  }

  private createBackground() {
    const rowCount = 2;
    const height = rowCount * this.rowHeight + this.padding * 2;

    const bg = new Graphics()
      .roundRect(0, 0, this.width, height, 6)
      .fill({ color: 0x000000, alpha: 0.5 });

    this.view.addChild(bg);
  }

  private createRows() {
    const labelStyle = new TextStyle({
      fontFamily: "RobotoMono",
      fontSize: 15,
      fill: 0xbbbbbb,
    });

    const countStyle = new TextStyle({
      fontFamily: "RobotoMono",
      fontSize: 15,
      fill: 0xffffff,
    });

    const createRow = (rowIndex: number, labelText: string) => {
      const y = this.padding + rowIndex * this.rowHeight;

      const label = new BitmapText({
        text: labelText,
        style: labelStyle,
      });

      label.position.set(this.padding, y);
      this.view.addChild(label);

      const count = new BitmapText({
        text: "0",
        style: countStyle,
      });

      count.anchor.set(1, 0); // Right align
      count.position.set(this.width - this.padding, y);

      this.view.addChild(count);
      return count;
    };

    this.kpsText = createRow(0, "KPS");
    this.totalText = createRow(1, "Total");
  }

  public addKeypress(timestamp: number) {
    this.timestamps.push(timestamp);
    this.total++;
    this.totalText.text = this.total;
  }

  public update() {
    const threshold =
      this.game.timeElapsed - 1000 * this.game.mods.playbackRate;

    const firstValidIndex = this.timestamps.findIndex(
      (timestamp) => timestamp >= threshold,
    );

    if (firstValidIndex > 0) {
      this.timestamps.splice(0, firstValidIndex);
    } else if (firstValidIndex === -1 && this.timestamps.length > 0) {
      this.timestamps.length = 0;
    }

    const kps = this.timestamps.length;
    this.kpsText.text = kps;
  }

  public resize() {
    this.view.pivot.x = this.width / 2;

    if (this.game.settings.ui.kpsCounter === "left") {
      this.view.x =
        this.game.app.screen.width / 2 -
        this.game.stageContainer.width / 2 -
        this.width / 2 -
        20 +
        this.game.stagePositionOffset;
    } else {
      this.view.x =
        this.game.app.screen.width / 2 +
        this.game.stageContainer.width / 2 +
        this.width / 2 +
        20 +
        this.game.stagePositionOffset;
    }

    if (this.game.settings.upscroll) {
      this.view.y = 150;
      if (
        this.game.settings.ui.judgementCounter ===
        this.game.settings.ui.kpsCounter
      ) {
        this.view.y += this.game.judgementCounter!.view.height + 10;
      }
    } else {
      this.view.pivot.y = this.view.height;

      this.view.y = this.game.app.screen.height - 150;
      if (
        this.game.settings.ui.judgementCounter ===
        this.game.settings.ui.kpsCounter
      ) {
        this.view.y -= this.game.judgementCounter!.view.height + 10;
      }
    }
  }
}
