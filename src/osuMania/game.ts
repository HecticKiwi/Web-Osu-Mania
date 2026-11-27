import type { TimelineDataPoint } from "@/components/game/timelineGraph";
import { CUSTOM_SOUND_OPTION } from "@/components/settings/sounds/customSoundSelect";
import type {
  BeatmapData,
  Break,
  Difficulty,
  HitObject,
  HitWindows,
  TimingPoint,
} from "@/lib/beatmapParser";
import { idb } from "@/lib/idb";
import { decodeMods } from "@/lib/replay";
import { createObjectURLWithExtension, patchLaneColors } from "@/lib/utils";
import type { ColumnColor, Settings } from "@/stores/settingsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { Column, GameState, PlayResults } from "@/types";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Howl } from "howler";
import type { BitmapText, Graphics, Ticker } from "pixi.js";
import * as PIXI from "pixi.js";
import { Application, Container, ResizePlugin, extensions } from "pixi.js";
import type { Dispatch, SetStateAction } from "react";
import {
  BASE_ASSETS_URL,
  getAllLaneColors,
  laneArrowDirections,
} from "./constants";
import type { Countdown } from "./sprites/countdown";
import type { ErrorBar } from "./sprites/errorBar";
import type { Fps } from "./sprites/fps";
import type { HealthBar } from "./sprites/healthBar";
import { ArrowHold } from "./sprites/hold/arrowHold";
import { BarHold } from "./sprites/hold/barHold";
import { CircleHold } from "./sprites/hold/circleHold";
import { DiamondHold } from "./sprites/hold/diamondHold";
import type { Judgement } from "./sprites/judgement";
import type { JudgementCounter } from "./sprites/judgementCounter";
import { ArrowKey } from "./sprites/key/arrowKey";
import { BarKey } from "./sprites/key/barKey";
import { CircleKey } from "./sprites/key/circleKey";
import { DiamondKey } from "./sprites/key/diamondKey";
import type { Key } from "./sprites/key/key";
import type { KpsCounter } from "./sprites/kpsCounter";
import type { ProgressBar } from "./sprites/progressBar";
import type { ProgressPie } from "./sprites/progressPie";
import type { StageCover } from "./sprites/stageCover";
import type { StageHint } from "./sprites/stageHint";
import { StageLight } from "./sprites/stageLight";
import { ArrowTap } from "./sprites/tap/arrowTap";
import { BarTap } from "./sprites/tap/barTap";
import { CircleTap } from "./sprites/tap/circleTap";
import { DiamondTap } from "./sprites/tap/diamondTap";
import { Tap } from "./sprites/tap/tap";
import type { TouchHitboxes } from "./sprites/touchHitboxes";
import { AudioSystem } from "./systems/audio";
import { HealthSystem, MIN_HEALTH } from "./systems/health";
import { HitObjectSystem } from "./systems/hitobject";
import { InputSystem } from "./systems/input";
import { ReplayPlayer } from "./systems/replayPlayer";
import type { ReplayData } from "./systems/replayRecorder";
import { ReplayRecorder } from "./systems/replayRecorder";
import { ScoreSystem } from "./systems/score";
import { UISystem } from "./systems/ui";

PixiPlugin.registerPIXI(PIXI);

export class Game {
  public app = new Application();
  private appInitialized = false;
  private disposed = false;
  public state: GameState = "WAIT";
  public showHud: boolean;

  public settings: Settings;
  public mods: Settings["mods"];
  public difficulty: Difficulty;
  public columnKeybinds: [string | null, string | null][];
  public hitWindows: HitWindows;
  public laneColors: readonly ColumnColor[];
  public laneArrowDirections: readonly number[]; // Only used for the arrow style
  public audioOffset: number;

  public hitPosition: number;
  public hitPositionOffset: number;
  public stagePositionOffset: number;
  public scaledColumnWidth: number;
  public notesContainerWidth: number;

  public systems: {
    health: HealthSystem;
    score: ScoreSystem;
    input: InputSystem;
    audio: AudioSystem;
    hitObject: HitObjectSystem;
    ui: UISystem;
    replayRecorder?: ReplayRecorder;
    replayPlayer?: ReplayPlayer;
  };

  // Classes for skin elements
  public tapClass:
    typeof BarTap | typeof CircleTap | typeof ArrowTap | typeof DiamondTap;
  public holdClass:
    typeof BarHold | typeof CircleHold | typeof ArrowHold | typeof DiamondHold;
  public keyClass:
    typeof BarKey | typeof CircleKey | typeof ArrowKey | typeof DiamondKey;

  // Hitobjects
  public hitObjects: HitObject[];
  public columns: Column[] = [];
  public currentColumnIndices: number[] = [];

  // UI Components
  public replayText?: BitmapText;
  public startMessage: BitmapText;
  public scoreText?: BitmapText;
  public comboText?: BitmapText;
  public accuracyText?: BitmapText;
  public stageSideWidth = 2;
  public stageContainer: Container = new Container();
  public stageSides: Graphics;
  public stageBackground: Container;
  public stageLights: StageLight[] = [];
  public stageCover: StageCover;
  public notesContainer: Container = new Container();
  public keysContainer: Container = new Container();
  public keys: Key[] = [];
  public touchHitboxes?: TouchHitboxes;
  public stageHint: StageHint;
  public judgement?: Judgement;
  public judgementCounter?: JudgementCounter;
  public kpsCounter?: KpsCounter;
  public progress?: ProgressBar | ProgressPie;
  public healthBar?: HealthBar;
  public errorBar?: ErrorBar;
  public fps?: Fps;
  public countdown: Countdown;

  public song: Howl;
  public timeElapsed = 0;
  private delay: number;

  public videoEl: HTMLVideoElement | null;

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

  private finished = false;

  // Results chart data
  public timelineData: TimelineDataPoint[] = [];

  public constructor(
    beatmapData: BeatmapData,
    setResults: Dispatch<SetStateAction<PlayResults | null>>,
    setIsPaused: Dispatch<SetStateAction<boolean>>,
    replayData: ReplayData | null,
    retry: () => void,
    videoEl: HTMLVideoElement | null,
  ) {
    gsap.registerPlugin(PixiPlugin);

    this.hitObjects = beatmapData.hitObjects;
    this.startTime = beatmapData.startTime;
    this.endTime = beatmapData.endTime;
    this.breaks = beatmapData.breaks;
    this.hitWindows = beatmapData.hitWindows;
    this.difficulty = beatmapData.difficulty;
    this.audioOffset = beatmapData.audioOffset;

    this.timingPoints = beatmapData.timingPoints;
    this.currentTimingPoint = this.timingPoints[0];
    this.nextTimingPoint = this.timingPoints[1];

    this.settings = JSON.parse(JSON.stringify(useSettingsStore.getState()));

    // If watching a replay, there should be no unpause delay
    if (replayData) {
      this.settings.unpauseDelay = 0;
    }

    this.mods = replayData ? decodeMods(replayData.mods) : this.settings.mods;

    if (this.settings.skin.colors.mode === "simple") {
      this.laneColors = getAllLaneColors(
        this.settings.skin.colors.simple.hue,
        this.settings.darkerHoldNotes,
      )[this.difficulty.keyCount - 1];
    } else {
      this.laneColors = patchLaneColors(
        this.settings.skin.colors.custom[this.difficulty.keyCount - 1],
      );
    }

    this.laneArrowDirections =
      laneArrowDirections[this.difficulty.keyCount - 1];

    this.setResults = (failed?: boolean) => {
      if (this.systems.replayRecorder) {
        this.systems.replayRecorder.replayData.timestamp = Date.now();
      }

      // The data points should already be in order, but just in case
      this.timelineData.sort((a, b) => a.time - b.time);

      setResults({
        320: this.systems.score[320],
        300: this.systems.score[300],
        200: this.systems.score[200],
        100: this.systems.score[100],
        50: this.systems.score[50],
        0: this.systems.score[0],
        score: this.systems.score.score,
        accuracy: this.systems.score.accuracy,
        maxCombo: this.systems.score.maxCombo,
        failed,
        viewingReplay: !!this.systems.replayPlayer,
        replayData: (this.systems.replayRecorder?.replayData ??
          this.systems.replayPlayer?.replayData)!,
        hitErrors: this.systems.score.hitErrors,
        timelineData: this.timelineData,
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

    this.columnKeybinds =
      this.settings.keybinds.keyModes[this.difficulty.keyCount - 1];

    this.song = beatmapData.song.howl;
    this.song.volume(this.settings.musicVolume);
    this.song.rate(this.mods.playbackRate);
    this.song.on("end", () => {
      // Seek back to the end so the progress bar stays full
      this.song.seek(this.song.duration());
    });

    this.videoEl = videoEl;
    if (videoEl) {
      videoEl.playbackRate = this.mods.playbackRate;
    }

    this.delay = beatmapData.delay;

    this.initSystems(beatmapData, replayData);
  }

  private initSystems(beatmapData: BeatmapData, replayData: ReplayData | null) {
    this.systems = {
      score: new ScoreSystem(this, this.hitObjects.length),
      input: new InputSystem(this),
      audio: new AudioSystem(this, beatmapData.sounds),
      health: new HealthSystem(this),
      hitObject: new HitObjectSystem(this),
      ui: new UISystem(this),
    };

    if (replayData) {
      this.systems.replayPlayer = new ReplayPlayer(this, replayData);
    } else {
      this.systems.replayRecorder = new ReplayRecorder(this, beatmapData);
    }
  }

  public dispose() {
    this.disposed = true;

    this.systems.input.dispose();
    this.systems.audio.dispose();

    window.removeEventListener("resize", this.systems.ui.resize);

    gsap.killTweensOf("*");
    gsap.globalTimeline.clear();

    // If app.init() is still pending, main() destroys the app once it resolves
    if (this.appInitialized) {
      this.destroyApp();
    }
  }

  private destroyApp() {
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

  async main(ref: HTMLDivElement, showHud: boolean) {
    extensions.remove(ResizePlugin);

    const initialBackgroundAlpha = this.settings.lightenBackgroundDuringBreaks
      ? this.settings.backgroundDim * 0.5
      : this.settings.backgroundDim;

    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: initialBackgroundAlpha,
      backgroundColor: "black",
      antialias: !this.settings.performanceMode,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      eventMode: "none",
      eventFeatures: {
        move: this.settings.touch.enabled,
        globalMove: false,
        click: this.settings.touch.enabled,
        wheel: false,
      },
    });
    this.appInitialized = true;

    // The game can be disposed while init is pending (e.g. the component
    // unmounted). Stop here instead of building on a destroyed app.
    if (this.disposed) {
      this.destroyApp();
      return;
    }

    await this.systems.audio.loadHitsounds();

    if (this.disposed) {
      return;
    }

    // Remove pointer cursor default so it can be hidden on keypress
    this.app.renderer.events.cursorStyles.pointer = "inherit";

    this.app.stage.eventMode = "passive";

    ref.appendChild(this.app.canvas);

    // For the debugger extension to detect the app
    window.__PIXI_APP__ = this.app;

    this.systems.ui.recalculateLayout();

    Tap.renderTexture = null;
    BarKey.markerGraphicsContext = null;
    CircleKey.bottomContainerBgGraphicsContext = null;
    CircleKey.markerGraphicsContext = null;
    DiamondKey.bottomContainerBgGraphicsContext = null;
    DiamondKey.markerGraphicsContext = null;
    DiamondHold.tailGraphicsContext = null;
    ArrowHold.tailGraphicsContext = null;
    StageLight.graphicsContext = null;

    this.tapClass.setTextures(this);

    this.systems.ui.addUi();

    // Set initial Y positions
    this.systems.hitObject.updateHitObjects();

    this.systems.ui.resize();
    this.systems.ui.setShowHud(showHud);

    window.addEventListener("resize", this.systems.ui.resize);

    // Game loop
    this.app.ticker.add((time) => this.update(time));
  }

  private update(time: Ticker) {
    this.fps?.update(time.FPS);
    this.systems.input.updateGamepadInputs();

    if (this.systems.input.pauseTapped && !this.finished) {
      this.setIsPaused((prev) => !prev);
    }

    switch (this.state) {
      case "WAIT":
        if (this.systems.replayPlayer || this.systems.input.anyColumnTapped()) {
          this.app.stage.removeChild(this.startMessage);

          if (this.startTime > 3000) {
            this.countdown.view.alpha = 1;
          }

          this.play();
        }

        break;

      case "PLAY":
        this.playUpdate();
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

    this.systems.input.clearInputs();
    this.systems.audio.playedSounds.clear();
  }

  private playUpdate(isAfterSeek?: boolean) {
    this.timeElapsed = Math.round(this.song.seek() * 1000);

    // Play video if it exists, accounting for audio delay
    if (
      this.state === "PLAY" &&
      this.videoEl?.paused &&
      this.timeElapsed > this.delay
    ) {
      this.videoEl.currentTime = this.song.seek();
      this.videoEl.play();
    }

    this.systems.replayPlayer?.update(this.timeElapsed, isAfterSeek);

    this.kpsCounter?.update();

    if (!this.mods.autoplay) {
      this.stageLights.forEach((stageLight) => stageLight.update());
      this.keys.forEach((key) => key.update());
    }

    if (this.timeElapsed < this.startTime) {
      this.countdown.update(this.startTime - this.timeElapsed, this.startTime);
    } else {
      this.countdown.updateBreak();
    }

    while (this.timeElapsed >= this.nextTimingPoint?.time) {
      this.currentTimingPoint = this.nextTimingPoint;
      this.nextTimingPoint =
        this.timingPoints[this.timingPoints.indexOf(this.nextTimingPoint) + 1];
    }

    this.progress?.update(this.timeElapsed, this.startTime, this.endTime);

    if (this.timeElapsed > this.endTime && !this.finished) {
      this.finished = true;
      this.finish();
    }

    const oldHealth = this.systems.health.health;

    this.systems.hitObject.updateHitObjects();

    if (this.healthBar && this.systems.health.health !== oldHealth) {
      const lostHealth = this.systems.health.health < oldHealth;
      this.healthBar.setHealth(this.systems.health.health, lostHealth);
    }

    if (this.systems.health.health <= MIN_HEALTH && !this.mods.noFail) {
      this.state = "FAIL";
    }

    if (!isAfterSeek) {
      this.judgement?.showJudgement();
    }
  }

  public setSfxVolume(volume: number) {
    this.settings.sfxVolume = volume;
  }

  public pause() {
    this.videoEl?.pause();
    this.song.pause();
    this.state = "PAUSE";
  }

  public resume() {
    if (this.song.seek() === 0) {
      this.state = "WAIT";
    } else {
      this.play();
    }
  }

  public play() {
    const shouldShowUnpauseCountdown =
      this.state === "PAUSE" &&
      this.timeElapsed > this.startTime &&
      this.settings.unpauseDelay > 0 &&
      (this.countdown.break == null ||
        this.countdown.break.endTime - this.timeElapsed <
          this.settings.unpauseDelay);

    if (shouldShowUnpauseCountdown) {
      // Replace break countdown, if it exists, with unpause countdown
      this.countdown.break = null;

      this.pauseCountdown = this.settings.unpauseDelay;
      this.state = "UNPAUSE";
    } else {
      if (this.videoEl) {
        this.videoEl.currentTime = this.song.seek();
        this.videoEl.play();
      }

      this.song.play();
      this.state = "PLAY";
    }
  }

  public seek(time: number) {
    for (const column of this.columns) {
      for (const hitObject of column) {
        hitObject.view.visible = false;
      }
    }

    this.currentColumnIndices = this.columns.map(() => 0);

    // Reset systems
    this.systems.score = new ScoreSystem(this, this.hitObjects.length);
    this.systems.health = new HealthSystem(this);
    this.systems.input.dispose();
    this.systems.input = new InputSystem(this);

    this.currentTimingPoint = this.timingPoints[0];
    this.nextTimingPoint = this.timingPoints[1];

    this.timelineData = [];

    if (this.systems.replayPlayer) {
      this.systems.replayPlayer.currentEventIndex = 0;
    }

    this.countdown.break = null;

    if (this.kpsCounter) {
      this.kpsCounter.timestamps.length = 0;
      this.kpsCounter.total = 0;
    }

    this.song.seek(time);

    this.timeElapsed = Math.round(time * 1000);
    if (this.videoEl) {
      this.videoEl.currentTime = time;
    }

    this.playUpdate(true);

    if (this.judgement) {
      this.judgement.judgementToShow = null;
    }
  }

  private async finish() {
    if (
      this.mods.accuracyChallenge?.mode === "maxAchievable" &&
      this.systems.score.accuracy < this.mods.accuracyChallenge.minAccuracy
    ) {
      this.fail();
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.systems.score.score = Math.round(this.systems.score.score);

    // Record remaining release inputs
    for (let i = 0; i < this.difficulty.keyCount; i++) {
      this.systems.replayRecorder?.record(i, false);
    }

    const applauseFile = this.settings.skin.sounds.applause;
    if (applauseFile === CUSTOM_SOUND_OPTION) {
      const customSound = await idb.getCustomSound("applause");
      if (customSound) {
        const url = createObjectURLWithExtension(customSound.file as File);

        new Howl({
          src: [url],
          preload: true,
          autoplay: true,
          onloaderror: (_, error) => {
            console.warn(error);
            URL.revokeObjectURL(url);
          },
          onplayerror: (_, error) => {
            console.warn(error);
          },
          onend: () => {
            URL.revokeObjectURL(url);
          },
        });
      }
    } else if (applauseFile) {
      new Howl({
        src: [`${BASE_ASSETS_URL}/skin/sounds/applause/${applauseFile}`],
        preload: true,
        autoplay: true,
        onloaderror: (_, error) => {
          console.warn(error);
        },
        onplayerror: (_, error) => {
          console.warn(error);
        },
      });
    }

    this.setResults();
  }

  private async fail() {
    this.song.stop();
    this.videoEl?.pause();

    if (this.settings.retryOnFail) {
      this.retry();
      return;
    }

    this.systems.score.score = Math.round(this.systems.score.score);

    // Record remaining release inputs
    for (let i = 0; i < this.difficulty.keyCount; i++) {
      this.systems.replayRecorder?.record(i, false);
    }

    const failFile = this.settings.skin.sounds.fail;
    if (failFile === CUSTOM_SOUND_OPTION) {
      const customSound = await idb.getCustomSound("fail");
      if (customSound) {
        const url = createObjectURLWithExtension(customSound.file as File);

        new Howl({
          src: [url],
          preload: true,
          autoplay: true,
          onloaderror: (_, error) => {
            console.warn(error);
            URL.revokeObjectURL(url);
          },
          onplayerror: (_, error) => {
            console.warn(error);
          },
          onend: () => {
            URL.revokeObjectURL(url);
          },
        });
      }
    } else if (failFile) {
      new Howl({
        src: [`${BASE_ASSETS_URL}/skin/sounds/fail/${failFile}`],
        preload: true,
        autoplay: true,
        onloaderror: (_, error) => {
          console.warn(error);
        },
        onplayerror: (_, error) => {
          console.warn(error);
        },
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.setResults(true);
  }
}
