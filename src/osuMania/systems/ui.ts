import { scaleWidth } from "@/lib/utils";
import {
  BitmapText,
  Container,
  FillGradient,
  Graphics,
  TextStyle,
} from "pixi.js";
import { laneWidths } from "../constants";
import type { Game } from "../game";
import { Countdown } from "../sprites/countdown";
import { ErrorBar } from "../sprites/errorBar";
import { Fps } from "../sprites/fps";
import { HealthBar } from "../sprites/healthBar";
import { Judgement } from "../sprites/judgement";
import { JudgementCounter } from "../sprites/judgementCounter";
import { KpsCounter } from "../sprites/kpsCounter";
import { ProgressBar } from "../sprites/progressBar";
import { ProgressPie } from "../sprites/progressPie";
import { StageCover } from "../sprites/stageCover";
import { StageHint } from "../sprites/stageHint";
import { StageLight } from "../sprites/stageLight";
import { TouchHitboxes } from "../sprites/touchHitboxes";

export class UISystem {
  public game: Game;

  constructor(game: Game) {
    this.game = game;

    this.resize = this.resize.bind(this);
  }

  public addUi() {
    if (this.game.systems.replayPlayer) {
      this.addReplayText();
    }

    if (this.game.settings.ui.showScore) {
      this.addScoreText();
    }
    this.addStageContainer();

    if (this.game.settings.ui.showCombo) {
      this.addComboText();
    }

    if (this.game.settings.ui.showAccuracy) {
      this.addAccuracyText();
    }
    if (this.game.settings.style === "bars") {
      this.addStageHint();

      if (!this.game.settings.performanceMode) {
        this.addStageLights();
      }
    }

    this.addKeys();

    if (!this.game.systems.replayPlayer && this.game.settings.touch.enabled) {
      this.addTouchHitboxes();
    }

    if (this.game.settings.ui.showJudgement) {
      this.addJudgement();
    }

    if (this.game.settings.ui.judgementCounter !== null) {
      this.addJudgementCounter();
    }

    if (this.game.settings.ui.kpsCounter !== null) {
      this.addKpsCounter();
    }

    this.game.systems.hitObject.addHitObjects();

    if (this.game.settings.ui.progressDisplay !== null) {
      this.addProgressBar();
    }
    this.addStartMessage();

    this.addCountdown();

    if (this.game.settings.showFpsCounter) {
      this.addFpsCounter();
    }

    if (this.game.settings.showErrorBar) {
      this.addHitError();
    }

    if (this.game.settings.ui.showHealthBar) {
      this.addHealthBar();
    }
  }

  public setShowHud(showHud: boolean) {
    this.game.showHud = showHud;

    [
      this.game.scoreText,
      this.game.comboText,
      this.game.accuracyText,
      this.game.judgementCounter,
      this.game.kpsCounter,
      this.game.progress,
      this.game.healthBar,
      this.game.errorBar,
      this.game.fps,
    ]
      .filter((item) => !!item)
      .map((item) => {
        if (item instanceof Container) {
          item.visible = showHud;
        } else {
          item.view.visible = showHud;
        }
      });
  }

  public resize() {
    this.game.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.recalculateLayout();

    this.game.startMessage.x =
      this.game.app.screen.width / 2 + this.game.stagePositionOffset;
    this.game.startMessage.y = this.game.app.screen.height / 2;

    this.game.stageHint?.resize();
    this.game.stageLights.forEach((stageLight) => stageLight.resize());

    this.game.keys.forEach((key) => key.resize());

    const fillGradient = new FillGradient({
      start: {
        x: 0,
        y: 1,
      },
      end: {
        x: 0,
        y: 0,
      },
      colorStops: [
        {
          offset: 0.4,
          color: "gray",
        },
        {
          offset: 1,
          color: "transparent",
        },
      ],
    });

    this.game.stageContainer.removeChild(this.game.stageSides);
    this.game.stageSides
      .clear()
      .rect(0, 0, this.game.stageSideWidth, this.game.app.screen.height)
      .rect(
        this.game.stageSideWidth + this.game.notesContainerWidth,
        0,
        this.game.stageSideWidth,
        this.game.app.screen.height,
      )
      .fill(fillGradient);

    this.game.stageContainer.addChild(this.game.stageSides);
    this.game.stageBackground.height = this.game.app.screen.height;

    this.game.stageContainer.pivot.x = this.game.stageContainer.width / 2;
    this.game.stageContainer.pivot.y = this.game.app.screen.height / 2;

    this.game.stageContainer.x =
      this.game.app.screen.width / 2 + this.game.stagePositionOffset;
    this.game.stageContainer.y = this.game.app.screen.height / 2;

    this.game.stageCover?.resize();

    this.game.touchHitboxes?.resize();

    this.game.judgement?.resize();

    this.game.judgementCounter?.resize();

    this.game.kpsCounter?.resize();

    if (this.game.comboText) {
      this.game.comboText.x =
        this.game.app.screen.width / 2 + this.game.stagePositionOffset;

      if (this.game.settings.upscroll) {
        this.game.comboText.y =
          this.game.app.screen.height * this.game.settings.ui.stageHudYPosition;
      } else {
        this.game.comboText.y =
          this.game.app.screen.height *
            (1 - this.game.settings.ui.stageHudYPosition) +
          50;
      }
    }

    if (this.game.errorBar) {
      this.game.errorBar.resize();
    }

    // Hud section
    if (this.game.scoreText) {
      this.game.scoreText.x = this.game.app.screen.width - 30;
      this.game.scoreText.scale = Math.min(
        (this.game.app.screen.width - 60) / 400,
        1,
      );
    }
    this.game.progress?.resize();
    this.game.healthBar?.resize();
    if (this.game.accuracyText) {
      this.game.accuracyText.x = this.game.app.screen.width - 30;
      this.game.accuracyText.scale = Math.min(
        (this.game.app.screen.width - 60) / 400,
        1,
      );
    }

    if (this.game.replayText) {
      this.game.replayText.x = this.game.app.screen.width / 2;

      if (this.game.settings.upscroll) {
        this.game.replayText.y = this.game.app.screen.height - 75;
      }
    }
  }

  public recalculateLayout() {
    this.game.stagePositionOffset =
      (this.game.settings.stagePosition *
        (this.game.app.screen.width - this.game.stageContainer.width)) /
      2;

    this.game.hitPosition =
      this.game.app.screen.height - this.game.hitPositionOffset;

    this.game.scaledColumnWidth = scaleWidth(
      laneWidths[this.game.difficulty.keyCount - 1] +
        this.game.settings.laneWidthAdjustment,
      this.game.app.screen.width,
    );

    // Cap column width on small screen widths
    if (
      this.game.scaledColumnWidth * this.game.difficulty.keyCount >
      this.game.app.screen.width
    ) {
      this.game.scaledColumnWidth =
        this.game.app.screen.width / this.game.difficulty.keyCount;
    }

    this.game.notesContainerWidth = Math.min(
      this.game.difficulty.keyCount * this.game.scaledColumnWidth +
        this.game.settings.laneSpacing * (this.game.difficulty.keyCount - 1),
      this.game.app.screen.width,
    );
  }

  private addReplayText() {
    const style = new TextStyle({
      fill: "transparent",
      stroke: 0xffffff,
      fontFamily: "RobotoMono",
      fontSize: 80,
      dropShadow: {
        alpha: 0.1,
        angle: 0,
        blur: 5,
        color: 0x000000,
        distance: 0,
      },
    });

    this.game.replayText = new BitmapText({
      text: "Replay",
      style,
    });

    this.game.replayText.anchor.set(0.5, 0.5);
    this.game.replayText.y = 50;
    this.game.replayText.x = this.game.app.screen.width / 2;
    this.game.replayText.alpha = 0.35;

    this.game.app.stage.addChild(this.game.replayText);
  }

  private addProgressBar() {
    if (this.game.settings.ui.progressDisplay === "bar") {
      this.game.progress = new ProgressBar(this.game);
    } else {
      this.game.progress = new ProgressPie(this.game);
    }

    this.game.app.stage.addChild(this.game.progress.view);
  }

  private addHealthBar() {
    this.game.healthBar = new HealthBar(this.game);
    this.game.app.stage.addChild(this.game.healthBar.view);
  }

  private addHitError() {
    this.game.errorBar = new ErrorBar(this.game);
    this.game.app.stage.addChild(this.game.errorBar.view);
  }

  private addScoreText() {
    const style = new TextStyle({
      fill: 0xdddddd,
      fontFamily: "RobotoMono",
      fontSize: 50,
      fontWeight: "400",
      dropShadow: {
        alpha: 0.8,
        angle: 0,
        blur: 5,
        color: 0x000000,
        distance: 0,
      },
    });

    this.game.scoreText = new BitmapText({
      text: "00000000",
      style,
    });

    this.game.scoreText.anchor.set(1, 0);
    this.game.scoreText.y = 30;
    this.game.scoreText.zIndex = 99;

    this.game.app.stage.addChild(this.game.scoreText);
  }

  private addComboText() {
    this.game.comboText = new BitmapText({
      text: "",
      style: {
        fill: 0xdddddd,
        fontFamily: "RobotoMono",
        fontSize: 30,
        fontWeight: "800",
      },
    });

    this.game.comboText.anchor.set(0.5);
    this.game.comboText.zIndex = 99;

    this.game.app.stage.addChild(this.game.comboText);
  }

  private addAccuracyText() {
    const style = new TextStyle({
      fill: 0xdddddd,
      fontFamily: "Courier New",
      fontSize: 30,
      fontWeight: "700",
      dropShadow: {
        alpha: 0.8,
        angle: 0,
        blur: 5,
        color: 0x000000,
        distance: 0,
      },
    });

    this.game.accuracyText = new BitmapText({
      text: "100.00%",
      style,
    });

    this.game.accuracyText.anchor.set(1, 0);
    this.game.accuracyText.y = 105;

    this.game.app.stage.addChild(this.game.accuracyText);
  }

  private addStageContainer() {
    this.game.stageBackground = new Graphics()
      .rect(0, 0, this.game.notesContainerWidth, this.game.app.screen.height)
      .fill(0x111111);
    this.game.stageBackground.alpha = this.game.settings.stageOpacity;
    this.game.notesContainer.addChild(this.game.stageBackground);

    this.game.stageSides = new Graphics();
    this.game.stageSides.alpha = this.game.settings.stageSidesOpacity;
    this.game.stageContainer.addChild(this.game.stageSides);

    this.game.notesContainer.x = this.game.stageSideWidth;
    this.game.notesContainer.interactiveChildren = false;

    this.game.stageContainer.eventMode = "passive";
    this.game.stageContainer.addChild(this.game.notesContainer);

    if (this.game.settings.upscroll) {
      this.game.stageContainer.scale.y = -1;
    }

    if (this.game.mods.cover) {
      this.game.stageCover = new StageCover(this.game);
      this.game.notesContainer.addChild(this.game.stageCover.view);
    }

    this.game.app.stage.addChild(this.game.stageContainer);
  }

  private addStageLights() {
    for (let i = 0; i < this.game.difficulty.keyCount; i++) {
      const stageLight = new StageLight(this.game, i);

      this.game.notesContainer.addChild(stageLight.view);

      this.game.stageLights.push(stageLight);
    }
  }

  private addStageHint() {
    this.game.stageHint = new StageHint(this.game);
    this.game.notesContainer.addChild(this.game.stageHint.view);
  }

  private addKeys() {
    for (let i = 0; i < this.game.difficulty.keyCount; i++) {
      const key = new this.game.keyClass(this.game, i);

      this.game.keysContainer.addChild(key.view);
      this.game.keysContainer.eventMode = "static";

      this.game.notesContainer.addChild(this.game.keysContainer);
      this.game.keys.push(key);
    }

    this.game.keys.forEach((key) => key.resize());
  }

  private addTouchHitboxes() {
    this.game.touchHitboxes = new TouchHitboxes(this.game);
    this.game.app.stage.addChild(this.game.touchHitboxes.view);
  }

  private addJudgement() {
    this.game.judgement = new Judgement(this.game);
    this.game.app.stage.addChild(this.game.judgement.view);
  }

  private addJudgementCounter() {
    this.game.judgementCounter = new JudgementCounter(this.game);
    this.game.app.stage.addChild(this.game.judgementCounter.view);
  }

  private addKpsCounter() {
    this.game.kpsCounter = new KpsCounter(this.game);
    this.game.app.stage.addChild(this.game.kpsCounter.view);
  }

  private addFpsCounter() {
    this.game.fps = new Fps(this.game);
    this.game.app.stage.addChild(this.game.fps.view);
  }

  private addStartMessage() {
    this.game.startMessage = new BitmapText({
      text: "Press any key to Start",
      style: {
        fill: 0xdddddd,
        fontFamily: "VarelaRound",
        fontSize: 30,
        fontWeight: "400",
        lineHeight: 0,
      },
    });

    this.game.startMessage.pivot.set(
      this.game.startMessage.width / 2,
      this.game.startMessage.height / 2,
    );

    this.game.startMessage.x = this.game.app.screen.width / 2;
    this.game.startMessage.y = this.game.app.screen.height / 2;

    this.game.app.stage.addChild(this.game.startMessage);
  }

  private addCountdown() {
    this.game.countdown = new Countdown(this.game);
    this.game.app.stage.addChild(this.game.countdown.view);
  }
}
