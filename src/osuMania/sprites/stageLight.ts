import { gsap } from "gsap";
import { Container, FillGradient, Graphics, GraphicsContext } from "pixi.js";
import { colors } from "../constants";
import { Game } from "../game";
import { Entity } from "./entity";

export class StageLight extends Entity {
  static graphicsContext: GraphicsContext | null;

  private columnId: number;
  public view: Container;

  constructor(game: Game, columnId: number) {
    super(game);

    this.columnId = columnId;

    const width = game.scaledColumnWidth;
    const height = game.app.screen.height * 0.3;

    if (!StageLight.graphicsContext) {
      const gradientFill = new FillGradient(0, height, 0, 0);
      gradientFill.addColorStop(0, "white");
      gradientFill.addColorStop(1, "transparent");

      StageLight.graphicsContext = new GraphicsContext()
        .rect(0, 0, width, height)
        .fill(gradientFill);
    }

    this.view = new Graphics(StageLight.graphicsContext);
    this.view.tint = colors[game.laneColors[columnId]];
    this.view.x = columnId * width;
    this.view.pivot.y = height;
    // this.view.zIndex = 1;
    this.view.alpha = 0;
  }

  public update() {
    if (this.game.inputSystem.pressedColumns[this.columnId]) {
      gsap.killTweensOf(this.view);
      this.view.alpha = 1;
    }

    if (this.game.inputSystem.releasedColumns[this.columnId]) {
      this.light();
    }
  }

  public resize() {
    this.view.height = this.game.app.screen.height * 0.35;
    this.view.y = this.game.hitPosition;
  }

  public light() {
    this.view.alpha = 1;

    gsap.to(this.view, {
      pixi: {
        alpha: 0,
      },
      duration: 0.3,
      overwrite: true,
    });
  }
}
