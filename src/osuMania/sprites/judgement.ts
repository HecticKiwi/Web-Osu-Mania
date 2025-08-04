import { BASE_PATH } from "@/lib/utils";
import { Judgement as JudgementValue } from "@/types";
import { gsap } from "gsap";
import { BitmapText, Container, Sprite, Texture } from "pixi.js";
import { Game } from "../game";

export class Judgement {
  public game: Game;

  public view: Container;
  public judgement: Sprite;
  public earlyOrLate: BitmapText;

  private timeout: NodeJS.Timeout | null = null;

  public judgementToShow: JudgementValue | null = null;
  public earlyOrLateToShow: "early" | "late" | null = null;

  public constructor(game: Game) {
    this.game = game;

    this.view = new Container();
    this.view.alpha = 0;
    this.view.zIndex = 99;

    this.judgement = new Sprite();
    this.judgement.anchor.set(0.5);
    this.view.addChild(this.judgement);

    this.earlyOrLate = new BitmapText({
      text: "",
      style: {
        fill: 0xcccccc,
        fontFamily: "RobotoMono",
        fontSize: 20,
        fontWeight: "400",
      },
    });
    this.earlyOrLate.y = -30;
    this.earlyOrLate.anchor.set(0.5);
    this.earlyOrLate.alpha = 0.5;
    this.view.addChild(this.earlyOrLate);
  }

  public resize() {
    this.view.x =
      this.game.app.screen.width / 2 + this.game.stagePositionOffset;

    if (this.game.settings.upscroll) {
      this.view.y = (this.game.app.screen.height * 2) / 3 - 50;
    } else {
      this.view.y = this.game.app.screen.height / 3;
    }
  }

  public showJudgement() {
    if (this.judgementToShow === null) {
      return;
    }

    const judgement = this.judgementToShow;
    const earlyOrLate = this.earlyOrLateToShow;

    this.judgement.texture = Texture.from(
      `${BASE_PATH}/skin/mania-hit${judgement === 320 ? "300g" : judgement}-0.png`,
    );

    this.view.alpha = 1;
    this.judgement.scale.set(1);
    this.earlyOrLate.scale.set(1);

    if (
      this.earlyOrLateToShow &&
      judgement <= this.game.settings.ui.earlyLateThreshold
    ) {
      if (earlyOrLate === "early") {
        this.earlyOrLate.text = "Early";
        this.earlyOrLate.tint = 0x26de63;
      } else if (earlyOrLate === "late") {
        this.earlyOrLate.text = "Late";
        this.earlyOrLate.tint = 0xde8826;
      }

      this.earlyOrLate.visible = true;
    } else {
      this.earlyOrLate.visible = false;
    }

    if (this.game.settings.performanceMode) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.view.visible = true;

      this.timeout = setTimeout(() => {
        this.view.visible = false;
      }, 1000);
    } else {
      gsap.from(this.judgement, {
        pixi: {
          scale: 1.2,
        },
        duration: 0.3,
        overwrite: true,
      });

      if (this.earlyOrLate.visible) {
        gsap.from(this.earlyOrLate, {
          pixi: {
            scale: 1.1,
          },
          duration: 0.3,
          overwrite: true,
        });
      }

      gsap.to(this.view, {
        pixi: {
          alpha: 0,
        },
        delay: 0.8,
        duration: 0.3,
        overwrite: true,
      });
    }

    this.judgementToShow = null;
    this.earlyOrLateToShow = null;
  }
}
