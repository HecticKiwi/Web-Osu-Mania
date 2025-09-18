import {
  BeatmapData,
  Break,
  Difficulty,
  HitObject,
  HitWindows,
  TimingPoint,
} from "@/lib/beatmapParser";
import { decodeMods } from "@/lib/replay";
import { scaleWidth } from "@/lib/utils";
import {
  ColumnColor,
  Settings,
  useSettingsStore,
} from "@/stores/settingsStore";
import { Column, GameState, PlayResults } from "@/types";
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
import {
  getAllLaneColors,
  laneArrowDirections,
  laneWidths,
  MAX_TIME_RANGE,
} from "./constants";
import { Countdown } from "./sprites/countdown";
import { ErrorBar } from "./sprites/errorBar";
import { Fps } from "./sprites/fps";
import { HealthBar } from "./sprites/healthBar";
import { ArrowHold } from "./sprites/hold/arrowHold";
import { BarHold } from "./sprites/hold/barHold";
import { CircleHold } from "./sprites/hold/circleHold";
import { DiamondHold } from "./sprites/hold/diamondHold";
import { Judgement } from "./sprites/judgement";
import { ArrowKey } from "./sprites/key/arrowKey";
import { BarKey } from "./sprites/key/barKey";
import { CircleKey } from "./sprites/key/circleKey";
import { DiamondKey } from "./sprites/key/diamondKey";
import { Key } from "./sprites/key/key";
import { ProgressBar } from "./sprites/progressBar";
import { StageHint } from "./sprites/stageHint";
import { StageLight } from "./sprites/stageLight";
import { ArrowTap } from "./sprites/tap/arrowTap";
import { BarTap } from "./sprites/tap/barTap";
import { CircleTap } from "./sprites/tap/circleTap";
import { DiamondTap } from "./sprites/tap/diamondTap";
import { Tap } from "./sprites/tap/tap";
import { TouchHitboxes } from "./sprites/touchHitboxes";
import { AudioSystem } from "./systems/audio";
import { HealthSystem, MIN_HEALTH } from "./systems/health";
import { InputSystem } from "./systems/input";
import { ReplayPlayer } from "./systems/replayPlayer";
import { ReplayData, ReplayRecorder } from "./systems/replayRecorder";
import { ScoreSystem } from "./systems/score";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Game {
  public app = new Application();
  public state: GameState = "WAIT";

  public settings: Settings;
  public difficulty: Difficulty;
  public columnKeybinds: (string | null)[];
  public hitWindows: HitWindows;
  public laneColors: readonly ColumnColor[];
  public laneArrowDirections: readonly number[]; // Only used for the arrow style

  public hitPosition: number;
  public hitPositionOffset: number;
  public stagePositionOffset: number;
  public scaledColumnWidth: number;

  // Systems
  public healthSystem?: HealthSystem;
  public scoreSystem: ScoreSystem;
  public inputSystem: InputSystem;
  public audioSystem: AudioSystem;

  // Replay Systems
  public replayRecorder?: ReplayRecorder;
  public replayPlayer?: ReplayPlayer;

  // Classes for skin elements
  public tapClass:
    | typeof BarTap
    | typeof CircleTap
    | typeof ArrowTap
    | typeof DiamondTap;
  public holdClass:
    | typeof BarHold
    | typeof CircleHold
    | typeof ArrowHold
    | typeof DiamondHold;
  public keyClass:
    | typeof BarKey
    | typeof CircleKey
    | typeof ArrowKey
    | typeof DiamondKey;

  // UI Components
  public replayText?: BitmapText;
  private startMessage: BitmapText;
  public scoreText?: BitmapText;
  public comboText?: BitmapText;
  public accuracyText?: BitmapText;
  public hitObjects: HitObject[];
  public columns: Column[] = [];
  public stageSideWidth = 2;
  public stageContainer: Container = new Container();
  public stageSides: Graphics;
  public stageBackground: Container;
  public stageLights: StageLight[] = [];
  public notesContainer: Container = new Container();
  public keysContainer: Container = new Container();
  public keys: Key[] = [];
  public touchHitboxes?: TouchHitboxes;
  public stageHint: StageHint;
  public judgement?: Judgement;
  private progressBar?: ProgressBar;
  public healthBar?: HealthBar;
  public errorBar?: ErrorBar;
  private fps?: Fps;
  private countdown: Countdown;

  public song: Howl;
  public timeElapsed: number = 0;

  public startTime: number;
  public endTime: number;

  public breaks: Break[];

  private pauseCountdown: number;

  public timingPoints: TimingPoint[];
  public currentTimingPoint: TimingPoint;
  private nextTimingPoint: TimingPoint;

  private setResults: (failed?: boolean) => void;
  private setIsPaused: Dispatch<SetStateAction<boolean>>;
  private retry: () => void;

  private finished: boolean = false;

  public constructor(
    beatmapData: BeatmapData,
    setResults: Dispatch<SetStateAction<PlayResults | null>>,
    setIsPaused: Dispatch<SetStateAction<boolean>>,
    replayData: ReplayData | null,
    retry: () => void,
  ) {
    this.resize = this.resize.bind(this);
    this.hitObjects = beatmapData.hitObjects;
    this.startTime = beatmapData.startTime;
    this.endTime = beatmapData.endTime;
    this.breaks = beatmapData.breaks;
    this.hitWindows = beatmapData.hitWindows;
    this.difficulty = beatmapData.difficulty;

    this.timingPoints = beatmapData.timingPoints;
    this.currentTimingPoint = this.timingPoints[0];
    this.nextTimingPoint = this.timingPoints[1];

    this.settings = useSettingsStore.getState();

    if (this.settings.skin.colors.mode === "simple") {
      this.laneColors = getAllLaneColors(this.settings.skin.colors.simple.hue)[
        this.difficulty.keyCount - 1
      ];
    } else {
      this.laneColors =
        this.settings.skin.colors.custom[this.difficulty.keyCount - 1];
    }

    this.laneArrowDirections =
      laneArrowDirections[this.difficulty.keyCount - 1];

    this.setResults = (failed?: boolean) => {
      if (this.replayRecorder) {
        this.replayRecorder.replayData.timestamp = Date.now();
      }

      setResults({
        320: this.scoreSystem[320],
        300: this.scoreSystem[300],
        200: this.scoreSystem[200],
        100: this.scoreSystem[100],
        50: this.scoreSystem[50],
        0: this.scoreSystem[0],
        score: this.scoreSystem.score,
        accuracy: this.scoreSystem.accuracy,
        maxCombo: this.scoreSystem.maxCombo,
        failed,
        viewingReplay: !!this.replayPlayer,
        replayData: (this.replayRecorder?.replayData ??
          this.replayPlayer?.replayData)!,
        hitErrors: this.scoreSystem.hitErrors,
      });
    };

    this.setIsPaused = setIsPaused;
    this.retry = retry;

    this.hitPositionOffset = this.settings.hitPositionOffset;

    if (this.settings.style === "bars") {
      this.tapClass = BarTap;
      this.holdClass = BarHold;
      this.keyClass = BarKey;
    } else if (this.settings.style === "circles") {
      this.tapClass = CircleTap;
      this.holdClass = CircleHold;
      this.keyClass = CircleKey;
    } else if (this.settings.style === "arrows") {
      this.tapClass = ArrowTap;
      this.holdClass = ArrowHold;
      this.keyClass = ArrowKey;
    } else {
      this.tapClass = DiamondTap;
      this.holdClass = DiamondHold;
      this.keyClass = DiamondKey;
    }

    if (this.settings.style !== "bars") {
      this.keysContainer.zIndex = -1;
    }

    this.columnKeybinds =
      this.settings.keybinds.keyModes[this.difficulty.keyCount - 1];

    if (replayData) {
      this.settings.mods = decodeMods(replayData.mods);

      this.replayPlayer = new ReplayPlayer(this, replayData);
    } else if (!this.settings.mods.autoplay) {
      this.replayRecorder = new ReplayRecorder(this, beatmapData);
    }

    this.scoreSystem = new ScoreSystem(this, this.hitObjects.length);
    this.inputSystem = new InputSystem(this);
    this.audioSystem = new AudioSystem(this, beatmapData.sounds);
    if (!this.settings.mods.noFail) {
      this.healthSystem = new HealthSystem(this);
    }

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

    gsap.killTweensOf("*");
    gsap.globalTimeline.clear();

    this.app.destroy(
      { removeView: true },
      {
        children: true,
        style: true,
        texture: true,
        // textureSource: true,
      },
    );

    window.__PIXI_APP__ = null;
  }

  private resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.recalculateLayout();

    this.startMessage.x = this.app.screen.width / 2 + this.stagePositionOffset;
    this.startMessage.y = this.app.screen.height / 2;

    this.stageHint?.resize();
    this.stageLights.forEach((stageLight) => stageLight.resize());

    const notesContainerWidth = Math.min(
      this.difficulty.keyCount * this.scaledColumnWidth,
      this.app.screen.width,
    );
    this.notesContainer.width = notesContainerWidth;
    this.keysContainer.width = notesContainerWidth;
    this.keys.forEach((key) => key.resize());

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

    this.stageContainer.x =
      this.app.screen.width / 2 + this.stagePositionOffset;
    this.stageContainer.y = this.app.screen.height / 2;

    this.touchHitboxes?.resize();

    this.judgement?.resize();

    if (this.comboText) {
      this.comboText.x = this.app.screen.width / 2 + this.stagePositionOffset;

      if (this.settings.upscroll) {
        this.comboText.y = (this.app.screen.height * 2) / 3;
      } else {
        this.comboText.y = this.app.screen.height / 3 + 50;
      }
    }

    if (this.errorBar) {
      this.errorBar.resize();
    }

    // Hud section
    if (this.scoreText) {
      this.scoreText.x = this.app.screen.width - 30;
      this.scoreText.scale = Math.min((this.app.screen.width - 60) / 400, 1);
    }
    this.progressBar?.resize();
    this.healthBar?.resize();
    if (this.accuracyText) {
      this.accuracyText.x = this.app.screen.width - 30;
      this.accuracyText.scale = Math.min((this.app.screen.width - 60) / 400, 1);
    }

    if (this.replayText) {
      this.replayText.x = this.app.screen.width / 2;

      if (this.settings.upscroll) {
        this.replayText.y = this.app.screen.height - 75;
      }
    }
  }

  private recalculateLayout() {
    this.stagePositionOffset =
      (this.settings.stagePosition *
        (this.app.screen.width - this.stageContainer.width)) /
      2;

    this.hitPosition = this.app.screen.height - this.hitPositionOffset;

    this.scaledColumnWidth = scaleWidth(
      laneWidths[this.difficulty.keyCount - 1] +
        this.settings.laneWidthAdjustment,
      this.app.screen.width,
    );

    // Cap column width on small screen widths
    if (
      this.scaledColumnWidth * this.difficulty.keyCount >
      this.app.screen.width
    ) {
      this.scaledColumnWidth = this.app.screen.width / this.difficulty.keyCount;
    }
  }

  async main(ref: HTMLDivElement) {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      antialias: !this.settings.performanceMode,
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

    this.recalculateLayout();

    Tap.renderTexture = null;
    BarKey.markerGraphicsContext = null;
    CircleKey.bottomContainerBgGraphicsContext = null;
    CircleKey.markerGraphicsContext = null;
    DiamondKey.bottomContainerBgGraphicsContext = null;
    DiamondKey.markerGraphicsContext = null;
    DiamondHold.tailGraphicsContext = null;
    ArrowHold.tailGraphicsContext = null;
    StageLight.graphicsContext = null;

    if (this.replayPlayer) {
      this.addReplayText();
    }

    if (this.settings.ui.showScore) {
      this.addScoreText();
    }
    this.addStageContainer();

    if (this.settings.ui.showCombo) {
      this.addComboText();
    }

    if (this.settings.ui.showAccuracy) {
      this.addAccuracyText();
    }
    if (this.settings.style === "bars") {
      this.addStageHint();

      if (!this.settings.performanceMode) {
        this.addStageLights();
      }
    }

    this.addKeys();

    if (!this.replayPlayer) {
      this.addTouchHitboxes();
    }

    if (this.settings.ui.showJudgement) {
      this.addJudgement();
    }
    this.addHitObjects();

    if (this.settings.ui.showProgressBar) {
      this.addProgressBar();
    }
    this.addStartMessage();

    this.addCountdown();

    if (this.settings.showFpsCounter) {
      this.addFpsCounter();
    }

    if (this.settings.showErrorBar) {
      this.addHitError();
    }

    if (!this.settings.mods.noFail && this.settings.ui.showHealthBar) {
      this.addHealthBar();
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
    this.inputSystem.updateGamepadInputs();

    this.replayPlayer?.update();

    if (this.inputSystem.pauseTapped && !this.finished) {
      this.setIsPaused((prev) => !prev);
    }

    if (!this.settings.mods.autoplay) {
      this.stageLights.forEach((stageLight) => stageLight.update());
      this.keys.forEach((key) => key.update());
    }

    switch (this.state) {
      case "WAIT":
        if (this.replayPlayer || this.inputSystem.anyColumnTapped()) {
          this.app.stage.removeChild(this.startMessage);

          if (this.startTime > 3000) {
            this.countdown.view.alpha = 1;
          }

          this.play();
        }

        break;

      case "PLAY":
        this.timeElapsed = Math.round(this.song.seek() * 1000);

        if (this.countdown.view.visible) {
          this.countdown.update(
            this.startTime - this.timeElapsed,
            this.startTime,
          );
        }

        if (this.timeElapsed >= this.nextTimingPoint?.time) {
          this.currentTimingPoint = this.nextTimingPoint;
          this.nextTimingPoint =
            this.timingPoints[
              this.timingPoints.indexOf(this.nextTimingPoint) + 1
            ];
        }

        this.progressBar?.update(
          this.timeElapsed,
          this.startTime,
          this.endTime,
        );

        if (this.timeElapsed > this.endTime && !this.finished) {
          this.finished = true;
          this.finish();
        }

        if (this.healthSystem) {
          const oldHealth = this.healthSystem.health;

          this.updateHitObjects();

          if (this.healthBar) {
            const lostHealth = this.healthSystem.health < oldHealth;
            this.healthBar.setHealth(this.healthSystem.health, lostHealth);
          }

          if (this.healthSystem.health <= MIN_HEALTH) {
            this.state = "FAIL";
          }
        } else {
          this.updateHitObjects();
        }

        this.judgement?.showJudgement();

        break;

      case "PAUSE":
        break;

      case "UNPAUSE":
        if (this.pauseCountdown <= 0) {
          this.play();
          break;
        }

        this.countdown.update(this.pauseCountdown, this.settings.unpauseDelay);
        this.pauseCountdown -= time.elapsedMS;

        break;

      case "FAIL":
        if (!this.finished) {
          this.finished = true;
          this.fail();
        }

        break;
      default:
        break;
    }

    this.inputSystem.clearInputs();
    this.audioSystem.playedSounds.clear();
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

    this.replayText = new BitmapText({
      text: "Replay",
      style,
    });

    this.replayText.anchor.set(0.5, 0.5);
    this.replayText.y = 50;
    this.replayText.x = this.app.screen.width / 2;
    this.replayText.alpha = 0.35;

    this.app.stage.addChild(this.replayText);
  }

  private addProgressBar() {
    this.progressBar = new ProgressBar(this);

    this.app.stage.addChild(this.progressBar.view);
  }

  private addHealthBar() {
    this.healthBar = new HealthBar(this);

    this.app.stage.addChild(this.healthBar.view);
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
    // this.notesContainer.zIndex = 1;

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
      const key = new this.keyClass(this, i);

      this.keysContainer.addChild(key.view);
      this.keysContainer.eventMode = "static";

      this.stageContainer.addChild(this.keysContainer);
      this.keys.push(key);
    }

    this.keys.forEach((key) => key.resize());
  }

  private addHitObjects() {
    const hitObjects = this.hitObjects.map((hitObjectData) => {
      if (hitObjectData.type === "tap") {
        return new this.tapClass(this, hitObjectData);
      } else {
        return new this.holdClass(this, hitObjectData);
      }
    });

    for (let i = 0; i < this.difficulty.keyCount; i++) {
      this.columns.push(
        hitObjects.filter((hitObject) => hitObject.data.column === i),
      );
    }
  }

  private addTouchHitboxes() {
    this.touchHitboxes = new TouchHitboxes(this);
    this.app.stage.addChild(this.touchHitboxes.view);
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
    if (this.state === "PAUSE" && this.timeElapsed > this.startTime) {
      this.pauseCountdown = this.settings.unpauseDelay;

      if (this.settings.unpauseDelay >= 500) {
        gsap.killTweensOf(this.countdown.view);
        this.countdown.view.alpha = 1;
        this.countdown.view.visible = true;
      }

      this.state = "UNPAUSE";
    } else {
      this.song.play();
      this.state = "PLAY";
    }
  }

  private async finish() {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.scoreSystem.score = Math.round(this.scoreSystem.score);

    // Record remaining release inputs
    for (let i = 0; i < this.difficulty.keyCount; i++) {
      this.replayRecorder?.record(i, false);
    }

    new Howl({
      src: [`/skin/applause.mp3`],
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

    this.setResults();
  }

  private async fail() {
    this.song.stop();

    if (this.settings.retryOnFail) {
      this.retry();
      return;
    }

    this.scoreSystem.score = Math.round(this.scoreSystem.score);

    // Record remaining release inputs
    for (let i = 0; i < this.difficulty.keyCount; i++) {
      this.replayRecorder?.record(i, false);
    }

    new Howl({
      src: [`/skin/failsound.mp3`],
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

    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.setResults(true);
  }

  // Returns the px offset of the hit object from the judgement line based on
  // how long it should take to reach the line
  public getHitObjectOffset(startTime: number, endTime: number) {
    if (this.settings.mods.constantSpeed) {
      const speed =
        this.hitPosition / (MAX_TIME_RANGE / this.settings.scrollSpeed);

      const offset =
        ((endTime - startTime) * speed) / this.settings.mods.playbackRate;

      return offset;
    }

    const flipped = startTime > endTime;
    if (flipped) {
      [startTime, endTime] = [endTime, startTime];
    }

    const currentTimingPointIndex = this.timingPoints.findIndex(
      (timingPoint) => startTime >= timingPoint.time,
    );

    let totalOffset = 0;
    for (let i = currentTimingPointIndex; i < this.timingPoints.length; i++) {
      const currentTimingPoint = this.timingPoints[i];
      const nextTimingPoint = this.timingPoints[i + 1];

      const intervalStart = Math.max(currentTimingPoint.time, startTime);
      const intervalEnd = nextTimingPoint
        ? Math.min(nextTimingPoint.time, endTime)
        : endTime;

      if (intervalStart < intervalEnd) {
        const duration = intervalEnd - intervalStart;
        const speed =
          this.hitPosition / (MAX_TIME_RANGE / currentTimingPoint.scrollSpeed);

        totalOffset += (duration * speed) / this.settings.mods.playbackRate;
      }
    }

    return flipped ? -totalOffset : totalOffset;
  }

  public updateHitObjects() {
    for (const column of this.columns) {
      let i = 0;

      while (i < column.length) {
        const hitObject = column[i];

        // Object may already be hit during replay
        if (!hitObject.shouldRemove) {
          hitObject.update();
        }

        if (hitObject.shouldRemove) {
          this.notesContainer.removeChild(hitObject.view);
          column.shift();
          i = 0;
        }

        // If you failed, you're done - no need to update any more hit objects
        if (this.healthSystem?.health === MIN_HEALTH) {
          return;
        }

        // If this hit object is above the top screen edge, there's no need to update the rest
        if (hitObject.view.y < 0) {
          break;
        }

        i++;
      }
    }
  }
}
