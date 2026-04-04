import { clamp } from "@/lib/math";
import { useSettingsStore } from "@/stores/settingsStore";
import { Container, Graphics } from "pixi.js";
import type { Game } from "../game";

export class ProgressPie {
  public game: Game;

  public view: Container;

  public progressPie: Graphics;

  constructor(game: Game) {
    this.game = game;

    this.view = new Container();
    this.view.interactiveChildren = false;
    this.view.y = 125;

    this.progressPie = new Graphics();
    this.update(0, 0, 1);

    this.view.addChild(this.progressPie);
  }

  public update(timeElapsed: number, startTime: number, endTime: number) {
    const radius = 20;
    const dotRadius = 3;
    const progress = clamp(
      (timeElapsed - startTime) / (endTime - startTime),
      0,
      1,
    );

    const startAngle = -Math.PI / 2; // Top center
    const endAngle = startAngle + Math.PI * 2 * progress;

    this.progressPie.clear();

    const hue = useSettingsStore.getState().hue;
    this.progressPie
      .moveTo(0, 0)
      .arc(0, 0, radius, startAngle, endAngle)
      .lineTo(0, 0)
      .fill({ color: `hsl(${hue}, 80%, 69%)`, alpha: 0.5 });

    this.progressPie.circle(0, 0, dotRadius).fill({ color: 0xffffff });

    // Optional: Add a white border like the image
    this.progressPie.circle(0, 0, radius).stroke({ color: 0xffffff, width: 2 });
  }

  public resize() {
    this.view.x = this.game.app.screen.width - 190;
  }
}
