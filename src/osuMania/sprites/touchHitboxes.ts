import { Container, Graphics } from "pixi.js";
import { Game } from "../game";

export class TouchHitboxes {
  public game: Game;

  public view: Container;

  private hitAreas: Graphics[] = [];

  constructor(game: Game) {
    this.game = game;

    this.view = new Container();
    this.view.eventMode = "passive";

    for (let i = 0; i < this.game.difficulty.keyCount; i++) {
      const hitArea = new Graphics();
      hitArea.width = 40;
      hitArea.height = 40;

      hitArea.eventMode = "static";
      hitArea.cursor = "pointer";

      hitArea.on("pointerdown", () => {
        this.game.inputSystem.hit(i);
        hitArea.alpha = Math.min(this.game.settings.touch.borderOpacity * 3, 1);
      });

      hitArea.on("pointerup", () => {
        this.game.inputSystem.release(i);
        hitArea.alpha = this.game.settings.touch.borderOpacity;
      });

      hitArea.on("pointerupoutside", () => {
        this.game.inputSystem.release(i);
        hitArea.alpha = this.game.settings.touch.borderOpacity;
      });

      this.hitAreas.push(hitArea);
      this.view.addChild(hitArea);
    }
  }

  private redrawHitAreas() {
    const hitAreaWidth =
      this.game.settings.touch.mode === "normal"
        ? this.game.scaledColumnWidth
        : this.game.app.screen.width / this.game.difficulty.keyCount;

    const borderWidth = 1;

    this.hitAreas.forEach((hitArea, i) => {
      hitArea.clear();
      hitArea
        .rect(hitAreaWidth * i, 0, hitAreaWidth, this.game.app.screen.height)
        .stroke({ width: borderWidth, color: "white" })
        .fill({ color: "transparent" });

      hitArea.alpha = this.game.settings.touch.borderOpacity;
    });
  }

  public resize() {
    const totalWidth =
      this.game.scaledColumnWidth * this.game.difficulty.keyCount;

    if (this.game.settings.touch.mode === "normal") {
      this.view.x = this.game.app.screen.width / 2 - totalWidth / 2;
    }

    this.redrawHitAreas();
  }
}
