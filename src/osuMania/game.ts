import { Settings } from "@/components/providers/settingsProvider";
import {
  BeatmapData,
  Difficulty,
  HitObject,
  HitWindows,
  TimingPoint,
} from "@/lib/beatmapParser";
import { getSettings, scaleWidth } from "@/lib/utils";
import { Column, GameState, Results } from "@/types";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Howl } from "howler";
import * as PIXI from "pixi.js";
import {
  Application,
  BitmapText,
  Container,
  FillGradient,
  Graphics,
  TextStyle,
  Ticker,
} from "pixi.js";
import { Dispatch, SetStateAction } from "react";
import { Color, laneColors, laneWidths, MAX_TIME_RANGE } from "./constants";
import { Countdown } from "./sprites/countdown";
import { ErrorBar } from "./sprites/errorBar";
import { Fps } from "./sprites/fps";
import { Hold } from "./sprites/hold";
import { Judgement } from "./sprites/judgement";
import { BarKey } from "./sprites/key/barKey";
import { CircleKey } from "./sprites/key/circleKey";
import { Key } from "./sprites/key/key";
import { ProgressBar } from "./sprites/progressBar";
import { StageHint } from "./sprites/stageHint";
import { StageLight } from "./sprites/stageLight";
import { Tap } from "./sprites/tap";
import { AudioSystem } from "./systems/audio";
import { InputSystem } from "./systems/input";
import { ScoreSystem } from "./systems/score";

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI(PIXI);

export class Game {
  public app = new Application();
  public state: GameState = "WAIT";

  public settings: Settings;
  public difficulty: Difficulty;
  public columnKeybinds: string[];
  public hitWindows: HitWindows;
  public laneColors: Color[];

  public hitPosition: number;
  public hitPositionOffset = 130;
  public scaledColumnWidth: number;

  // Systems
  public scoreSystem: ScoreSystem;
  public inputSystem: InputSystem;
  public audioSystem: AudioSystem;

  // UI Components
  private startMessage: BitmapText;
  public scoreText: BitmapText;
  public comboText: BitmapText;
  public accuracyText: BitmapText;
  public hitObjects: HitObject[];
  public columns: Column[] = [];
  public stageSideWidth = 2;
  public stageContainer: Container = new Container();
  public stageSides: Graphics;
  public stageBackground: Container;
  public stageLights: StageLight[] = [];
  public notesContainer: Container = new Container();
  public keys: Key[] = [];
  public stageHint: StageHint;
  public judgement: Judgement;
  private progressBar: ProgressBar;
  public errorBar: ErrorBar;
  private fps?: Fps;
  private countdown?: Countdown;

  public song: Howl;
  public timeElapsed: number = 0;

  public startTime: number;
  public endTime: number;

  public timingPoints: TimingPoint[];
  public currentTimingPoint: TimingPoint;
  private nextTimingPoint: TimingPoint;

  private setResults: Dispatch<SetStateAction<Results | null>>;
  private finished: boolean = false;

  public constructor(
    beatmapData: BeatmapData,
    setResults: Dispatch<SetStateAction<Results | null>>,
  ) {
    this.resize = this.resize.bind(this);

    this.hitObjects = beatmapData.hitObjects;
    this.startTime = beatmapData.startTime;
    this.endTime = beatmapData.endTime;
    this.hitWindows = beatmapData.hitWindows;
    this.difficulty = beatmapData.difficulty;

    this.timingPoints = beatmapData.timingPoints;
    this.currentTimingPoint = this.timingPoints[0];
    this.nextTimingPoint = this.timingPoints[1];

    this.laneColors = laneColors[this.difficulty.keyCount - 1];

    this.setResults = setResults;

    this.settings = getSettings();

    this.columnKeybinds =
      this.settings.keybinds.keyModes[this.difficulty.keyCount - 1];

    // Init systems
    this.scoreSystem = new ScoreSystem(this, this.hitObjects.length);
    this.inputSystem = new InputSystem(this);
    this.audioSystem = new AudioSystem(this, beatmapData.sounds);

    this.song = beatmapData.song.howl;
    this.song.volume(this.settings.musicVolume);
    this.song.rate(this.settings.mods.playbackRate);
    this.song.on("end", async () => {
      // Seek back to the end so the progress bar stays full
      this.song.seek(this.song.duration());
    });
  }

  public dispose() {
    this.inputSystem.dispose();
    this.audioSystem.dispose();

    window.removeEventListener("resize", this.resize);

    this.app.destroy({ removeView: true });

    window.__PIXI_APP__ = null;
  }

  private resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.scaledColumnWidth = scaleWidth(
      laneWidths[this.difficulty.keyCount - 1],
      this.app.screen.width,
    );

    // Cap column width on small screen widths
    if (
      this.scaledColumnWidth * this.difficulty.keyCount >
      this.app.screen.width
    ) {
      this.scaledColumnWidth = this.app.screen.width / this.difficulty.keyCount;
    }

    this.hitPosition = this.app.screen.height - this.hitPositionOffset;

    this.startMessage.x = this.app.screen.width / 2;
    this.startMessage.y = this.app.screen.height / 2;

    this.keys.forEach((key) => key.resize());

    this.stageHint?.resize();
    this.stageLights.forEach((stageLight) => stageLight.resize());

    const notesContainerWidth = Math.min(
      this.difficulty.keyCount * this.scaledColumnWidth,
      this.app.screen.width,
    );
    this.notesContainer.width = notesContainerWidth;

    const gradientFill = new FillGradient(0, this.app.screen.height, 0, 0);
    gradientFill.addColorStop(0.4, "gray");
    gradientFill.addColorStop(1, "transparent");

    this.stageContainer.removeChild(this.stageSides);
    this.stageSides
      .clear()
      .rect(0, 0, this.stageSideWidth, this.app.screen.height)
      .rect(
        this.stageSideWidth + this.notesContainer.width,
        0,
        this.stageSideWidth,
        this.app.screen.height,
      )
      .fill(gradientFill);

    this.stageContainer.addChild(this.stageSides);
    this.stageBackground.height = this.app.screen.height;

    this.stageContainer.pivot.x = this.stageContainer.width / 2;
    this.stageContainer.pivot.y = this.app.screen.height / 2;

    this.stageContainer.x = this.app.screen.width / 2;
    this.stageContainer.y = this.app.screen.height / 2;

    this.judgement.resize();

    this.comboText.x = this.app.screen.width / 2;

    if (this.settings.upscroll) {
      this.comboText.y = (this.app.screen.height * 2) / 3;
    } else {
      this.comboText.y = this.app.screen.height / 3 + 50;
    }

    if (this.errorBar) {
      this.errorBar.resize();
    }

    // Hud section
    this.scoreText.x = this.app.screen.width - 30;
    this.scoreText.scale = Math.min((this.app.screen.width - 60) / 400, 1);
    this.progressBar.resize();
    this.accuracyText.x = this.app.screen.width - 30;
    this.accuracyText.scale = Math.min((this.app.screen.width - 60) / 400, 1);
  }

  async main(ref: HTMLDivElement) {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0.5,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      eventMode: "none",
      eventFeatures: {
        move: true,
        globalMove: false,
        click: true,
        wheel: false,
      },
    });

    this.app.stage.eventMode = "passive";

    ref.appendChild(this.app.canvas);

    // For the debugger extension to detect the app
    window.__PIXI_APP__ = this.app;

    this.hitPosition = this.app.screen.height - this.hitPositionOffset;

    this.scaledColumnWidth = scaleWidth(
      laneWidths[this.difficulty.keyCount - 1],
      this.app.screen.width,
    );

    Tap.renderTexture = null;
    Key.bottomContainerBgGraphicsContext = null;
    Key.markerGraphicsContext = null;
    Key.hitAreaGraphicsContext = null;
    StageLight.graphicsContext = null;

    this.addScoreText();

    this.addStageContainer();

    this.addComboText();

    this.addAccuracyText();

    if (this.settings.style === "bars") {
      this.addStageHint();

      this.addStageLights();
    }

    this.addKeys();

    this.addJudgement();

    this.addHitObjects();

    this.addProgressBar();

    this.addStartMessage();

    if (this.startTime > 3000) {
      this.addCountdown();
    }

    if (this.settings.showFpsCounter) {
      this.addFpsCounter();
    }

    if (this.settings.showErrorBar) {
      this.addHitError();
    }

    // Set initial Y positions
    this.updateHitObjects();

    this.resize();

    window.addEventListener("resize", this.resize);

    // Game loop
    this.app.ticker.add((time) => this.update(time));
  }

  private update(time: Ticker) {
    this.fps?.update(time.FPS);

    if (!this.settings.mods.autoplay) {
      this.stageLights.forEach((stageLight) => stageLight.update());
      this.keys.forEach((key) => key.update());
    }

    switch (this.state) {
      case "WAIT":
        if (this.inputSystem.anyKeyTapped()) {
          this.app.stage.removeChild(this.startMessage);

          if (this.countdown) {
            this.countdown.view.alpha = 1;
          }

          this.play();
        }

        break;

      case "PLAY":
        this.timeElapsed = this.song.seek() * 1000;

        if (this.countdown && this.timeElapsed < this.startTime) {
          this.countdown.update();
        }

        if (this.timeElapsed >= this.nextTimingPoint?.time) {
          this.currentTimingPoint = this.nextTimingPoint;
          this.nextTimingPoint =
            this.timingPoints[
              this.timingPoints.indexOf(this.nextTimingPoint) + 1
            ];
        }

        this.progressBar.update(this.timeElapsed, this.startTime, this.endTime);

        this.updateHitObjects();

        if (this.timeElapsed > this.endTime && !this.finished) {
          this.finished = true;
          this.finish();
        }

        break;

      case "PAUSE":
        break;

      default:
        break;
    }

    this.inputSystem.clearInputs();
    this.audioSystem.playedSounds.clear();
  }

  private addProgressBar() {
    this.progressBar = new ProgressBar(this);

    this.app.stage.addChild(this.progressBar.view);
  }

  private addHitError() {
    this.errorBar = new ErrorBar(this);

    this.app.stage.addChild(this.errorBar.view);
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

    this.scoreText = new BitmapText({
      text: "00000000",
      style,
    });

    this.scoreText.anchor.set(1, 0);
    this.scoreText.y = 30;
    this.scoreText.zIndex = 99;

    this.app.stage.addChild(this.scoreText);
  }

  private addComboText() {
    this.comboText = new BitmapText({
      text: "",
      style: {
        fill: 0xdddddd,
        fontFamily: "RobotoMono",
        fontSize: 30,
        fontWeight: "800",
      },
    });

    this.comboText.anchor.set(0.5);
    this.comboText.zIndex = 99;

    this.app.stage.addChild(this.comboText);
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

    this.accuracyText = new BitmapText({
      text: "100.00%",
      style,
    });

    this.accuracyText.anchor.set(1, 0);
    this.accuracyText.y = 105;

    this.app.stage.addChild(this.accuracyText);
  }

  private addStageContainer() {
    const notesContainerWidth =
      this.difficulty.keyCount * this.scaledColumnWidth;

    this.stageBackground = new Graphics()
      .rect(0, 0, notesContainerWidth, this.app.screen.height)
      .fill(0x000000);
    this.stageBackground.alpha = 0.5;
    this.notesContainer.addChild(this.stageBackground);

    this.stageSides = new Graphics();
    this.stageContainer.addChild(this.stageSides);

    this.notesContainer.x = this.stageSideWidth;
    this.notesContainer.interactiveChildren = false;

    this.stageContainer.eventMode = "passive";
    this.stageContainer.addChild(this.notesContainer);

    if (this.settings.upscroll) {
      this.stageContainer.scale.y = -1;
    }

    this.app.stage.addChild(this.stageContainer);
  }

  private addStageLights() {
    for (let i = 0; i < this.difficulty.keyCount; i++) {
      const stageLight = new StageLight(this, i);

      this.notesContainer.addChild(stageLight.view);

      this.stageLights.push(stageLight);
    }
  }

  private addStageHint() {
    this.stageHint = new StageHint(this);

    this.notesContainer.addChild(this.stageHint.view);
  }

  private addKeys() {
    for (let i = 0; i < this.difficulty.keyCount; i++) {
      let key: Key;
      if (this.settings.style === "bars") {
        key = new BarKey(this, i);
      } else {
        key = new CircleKey(this, i);
      }

      this.stageContainer.addChild(key.view);
      this.keys.push(key);
    }
  }

  private addHitObjects() {
    const hitObjects = this.hitObjects.map((hitObjectData) => {
      if (hitObjectData.type === "tap") {
        return new Tap(this, hitObjectData);
      } else {
        return new Hold(this, hitObjectData);
      }
    });

    for (let i = 0; i < this.difficulty.keyCount; i++) {
      this.columns.push(
        hitObjects.filter((hitObject) => hitObject.data.column === i),
      );
    }
  }

  private addJudgement() {
    this.judgement = new Judgement(this);

    this.app.stage.addChild(this.judgement.view);
  }

  private addFpsCounter() {
    this.fps = new Fps(this);
    this.app.stage.addChild(this.fps.view);
  }

  private addStartMessage() {
    this.startMessage = new BitmapText({
      text: "Press any key to Start",
      style: {
        fill: 0xdddddd,
        fontFamily: "VarelaRound",
        fontSize: 30,
        fontWeight: "400",
        lineHeight: 0,
      },
    });

    this.startMessage.pivot.set(
      this.startMessage.width / 2,
      this.startMessage.height / 2,
    );

    this.startMessage.x = this.app.screen.width / 2;
    this.startMessage.y = this.app.screen.height / 2;

    this.app.stage.addChild(this.startMessage);
  }

  private addCountdown() {
    this.countdown = new Countdown(this);
    this.app.stage.addChild(this.countdown.view);
  }

  public pause() {
    this.song.pause();
    this.state = "PAUSE";
  }

  public async play() {
    this.song.play();
    this.state = "PLAY";
  }

  private async finish() {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    new Howl({
      src: ["/skin/applause.mp3"],
      format: "mp3",
      preload: true,
      autoplay: true,
      onloaderror: (_, error) => {
        console.warn(error);
      },
      onplayerror: (_, error) => {
        console.warn(error);
      },
    });

    this.setResults({
      320: this.scoreSystem[320],
      300: this.scoreSystem[300],
      200: this.scoreSystem[200],
      100: this.scoreSystem[100],
      50: this.scoreSystem[50],
      0: this.scoreSystem[0],
      score: this.scoreSystem.score,
      accuracy: this.scoreSystem.accuracy,
      maxCombo: this.scoreSystem.maxCombo,
    });
  }

  // Returns the px offset of the hit object from the judgement line based on
  // how long it should take to reach the line
  public getHitObjectOffset(time: number) {
    const speed =
      this.hitPosition / (MAX_TIME_RANGE / this.settings.scrollSpeed);

    return (time * speed) / this.settings.mods.playbackRate;
  }

  public updateHitObjects() {
    this.columns.forEach((column) => {
      let itemsToRemove = 0;

      for (const hitObject of column) {
        hitObject.update();

        if (hitObject.shouldRemove) {
          itemsToRemove++;
        }

        // If this hit object is above the top screen edge, there's no need to update the rest
        if (hitObject.view.y < 0) {
          break;
        }
      }

      for (let i = 0; i < itemsToRemove; i++) {
        this.notesContainer.removeChild(column[i].view);
        column.shift();
      }
    });
  }
}
