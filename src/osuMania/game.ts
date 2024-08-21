import { Settings } from "@/components/providers/settingsProvider";
import {
  BeatmapData,
  Difficulty,
  HitObject,
  TimingPoint,
} from "@/lib/beatmapParser";
import {
  clamp,
  getSettings,
  processIniString,
  scaleEntityWidth,
  scaleWidth,
} from "@/lib/utils";
import { Column, GameState, HitWindows, Results } from "@/types";
import { Howl } from "howler";
import { parse } from "ini";
import {
  Application,
  Container,
  Graphics,
  HTMLText,
  Sprite,
  Text,
  TextStyle,
  Ticker,
} from "pixi.js";
import { loadAssets } from "./assets";
import { TEXTURES, getHitWindows } from "./constants";
import { ErrorBar } from "./sprites/errorBar";
import { Fps } from "./sprites/fps";
import { Hold } from "./sprites/hold";
import { Judgement } from "./sprites/judgement";
import { Key } from "./sprites/key";
import { StageLight } from "./sprites/stageLight";
import { Tap } from "./sprites/tap";
import { AudioSystem } from "./systems/audio";
import { InputSystem } from "./systems/input";
import { ScoreSystem } from "./systems/score";

export class Game {
  public app = new Application();
  public state: GameState = "WAIT";

  // Relative to bottom of screen
  public hitPosition: number;

  public settings: Settings;
  public difficulty: Difficulty;
  public columnKeybinds: string[];
  public hitWindows: HitWindows;

  // Too lazy to properly type this
  public skinIni: any; // https://osu.ppy.sh/wiki/en/Skinning/skin.ini#[mania]
  public skinManiaIni: any;

  // Systems
  public scoreSystem: ScoreSystem;
  public inputSystem: InputSystem;
  public audioSystem: AudioSystem;

  // UI Components
  private startMessage: Container;
  public scoreText: Text;
  public comboText: Text;
  public accuracyText: Text;
  public hitObjects: HitObject[];
  public columns: Column[] = [];
  public notesContainer: Container = new Container();
  public stageSides: Graphics;
  public stageBackground: Graphics;
  public stageLights: StageLight[] = [];
  public keys: Key[] = [];
  public stageHint: Sprite;
  public judgement: Judgement;
  private progressBarContainer: Container;
  private progressBar: Container;
  public hitError: ErrorBar;
  private fps?: Fps;

  public song: Howl;

  // Derived from the hitobjects, not the song file
  public startTime: number;
  public endTime: number;

  public timingPoints: TimingPoint[];
  public currentTimingPoint: TimingPoint;
  private nextTimingPoint: TimingPoint;

  public timeElapsed: number = 0;

  public constructor(
    beatmapData: BeatmapData,
    setResults: (results: Results) => void,
  ) {
    this.resize = this.resize.bind(this);

    this.hitObjects = beatmapData.hitObjects;
    this.difficulty = beatmapData.difficulty;

    this.timingPoints = beatmapData.timingPoints;
    this.currentTimingPoint = this.timingPoints[0];
    this.nextTimingPoint = this.timingPoints[1];

    // Set start/end times
    this.startTime = this.hitObjects[0].time;
    const lastHitObject = this.hitObjects[this.hitObjects.length - 1];
    this.endTime =
      lastHitObject.type === "hold"
        ? lastHitObject.endTime
        : lastHitObject.time;

    this.settings = getSettings();

    this.columnKeybinds =
      this.settings.keybinds.keyModes[this.difficulty.keyCount - 1];

    // Init systems
    this.scoreSystem = new ScoreSystem(this, this.hitObjects.length);
    this.inputSystem = new InputSystem();
    this.audioSystem = new AudioSystem(this, beatmapData.sounds);

    this.song = new Howl({
      volume: this.settings.musicVolume,
      src: [beatmapData.audio.url],
      format: "wav",
      preload: true,
      rate: this.settings.playbackRate,
      onloaderror: (id, error) => {
        console.log(error);
      },
      onend: async () => {
        // Seek back to the end so the progress bar stays full
        this.song.seek(this.song.duration());

        await new Promise((resolve) => setTimeout(resolve, 1000));

        new Howl({
          src: ["/skin/applause.mp3"],
          format: "mp3",
          preload: true,
          autoplay: true,
          onloaderror: (_, error) => {
            console.log(error);
          },
          onplayerror: (_, error) => {
            console.log(error);
          },
        });

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
        });
      },
    });

    this.hitWindows = getHitWindows(this.difficulty.od);
  }

  public dispose() {
    this.inputSystem.dispose();
    this.audioSystem.dispose();

    window.removeEventListener("resize", this.resize);

    this.app.destroy({ removeView: true });
  }

  private resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.startMessage.x = this.app.screen.width / 2;
    this.startMessage.y = this.app.screen.height / 2;

    this.hitPosition = this.app.screen.height - 130;

    this.scoreText.x = this.app.screen.width - 30;

    this.notesContainer.x = this.app.screen.width / 2;
    this.keys.forEach((key) => (key.sprite.y = this.app.screen.height));
    this.stageHint.y = this.hitPosition;
    this.stageLights.forEach(
      (stageLight) => (stageLight.sprite.y = this.hitPosition),
    );

    const width = this.difficulty.keyCount * this.skinManiaIni.ColumnWidth;
    const stageSideWidth = 10;
    this.notesContainer.removeChild(this.stageSides);
    this.stageSides = new Graphics()
      .rect(-stageSideWidth, 0, stageSideWidth, this.app.screen.height)
      .rect(width, 0, stageSideWidth, this.app.screen.height)
      .fill(0x7f7f7f);
    this.notesContainer.addChild(this.stageSides);
    this.stageBackground.height = this.app.screen.height;

    this.progressBarContainer.x = this.app.screen.width - 30;

    this.judgement.sprite.anchor.set(0.5);
    this.judgement.sprite.x = width / 2;
    this.judgement.sprite.y = this.app.screen.height / 3;

    this.comboText.x = width / 2;
    this.comboText.y = this.app.screen.height / 3 + 50;

    if (this.hitError) {
      this.hitError.container.x = this.app.screen.width / 2;
    }

    this.accuracyText.x = this.app.screen.width - 30;

    this.hitError.container.y = this.app.screen.height;
  }

  async main(ref: HTMLDivElement) {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      antialias: true,
    });

    ref.appendChild(this.app.canvas);

    await this.loadIni();

    await loadAssets();

    this.addScoreText();

    this.addNotesContainer();

    this.addComboText();

    this.addAccuracyText();

    this.addStageLights();

    this.addStageHint();

    this.addKeys();

    this.addJudgement();

    this.addHitObjects();

    this.addProgressBar();

    this.addStartMessage();

    if (this.settings.showFpsCounter) {
      this.addFpsCounter();
    }

    if (this.settings.showErrorBar) {
      this.addHitError();
    }

    // Set initial Y positions
    this.columns.forEach((column) => {
      column.forEach((hitObject) => {
        hitObject.update();
      });
    });

    this.resize();

    window.addEventListener("resize", this.resize);

    // Game loop
    this.app.ticker.add((time) => this.update(time));
  }

  private async loadIni() {
    const iniString = await fetch("/skin/skin.ini")
      .then((response) => response.text())
      .then((text) => processIniString(text));

    this.skinIni = parse(iniString);
    this.skinManiaIni = this.skinIni[`Mania${this.difficulty.keyCount}`];

    this.skinManiaIni.ColumnWidth = scaleWidth(
      this.skinManiaIni.ColumnWidth.split(",")[0],
      this.app.screen.width,
    );
  }

  private update(time: Ticker) {
    this.fps?.update(time.FPS);

    switch (this.state) {
      case "WAIT":
        if (this.inputSystem.tappedKeys.has(" ")) {
          this.app.stage.removeChild(this.startMessage);
          this.play();
        }

        break;

      case "PLAY":
        this.timeElapsed = this.song.seek() * 1000;

        if (this.timeElapsed >= this.nextTimingPoint?.time) {
          this.currentTimingPoint = this.nextTimingPoint;
          this.nextTimingPoint =
            this.timingPoints[
              this.timingPoints.indexOf(this.nextTimingPoint) + 1
            ];
        }

        this.progressBar.width =
          clamp(
            (this.timeElapsed - this.startTime) /
              (this.endTime - this.startTime),
            0,
            1,
          ) * 400;

        this.stageLights.forEach((stageLight) =>
          stageLight.update(time.deltaMS),
        );

        this.keys.forEach((key) => key.update(time.deltaMS));

        this.columns.forEach((column) => {
          const itemsToRemove: (Tap | Hold)[] = [];

          column.forEach((hitObject) => {
            hitObject.update(time.deltaMS);

            if (hitObject.shouldRemove) {
              itemsToRemove.push(hitObject);
            }
          });

          itemsToRemove.forEach((itemToRemove) => {
            const indexToRemove = column.indexOf(itemToRemove);
            if (indexToRemove !== -1) {
              column.splice(indexToRemove, 1);
              this.notesContainer.removeChild(itemToRemove.view);
            }
          });
        });

        this.stageLights.forEach((stageLight) =>
          stageLight.update(time.deltaTime),
        );

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
    const fullWidth = 400;
    const progressBarBg = new Graphics()
      .rect(0, 0, fullWidth, 5)
      .fill(0xffffff);
    progressBarBg.alpha = 0.1;

    this.progressBar = new Graphics().rect(0, 0, 0.01, 5).fill(0x71acef);

    this.progressBarContainer = new Container();
    this.progressBarContainer.addChild(progressBarBg);
    this.progressBarContainer.addChild(this.progressBar);

    this.progressBarContainer.pivot.set(fullWidth, 0);
    this.progressBarContainer.y = 95;

    this.app.stage.addChild(this.progressBarContainer);
  }

  private addHitError() {
    this.hitError = new ErrorBar(this);

    this.app.stage.addChild(this.hitError.container);
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

    this.scoreText = new Text({
      text: "00000000",
      style,
    });

    this.scoreText.anchor.set(1, 0);
    this.scoreText.y = 30;
    this.scoreText.zIndex = 99;

    this.app.stage.addChild(this.scoreText);
  }

  private addComboText() {
    this.comboText = new Text({
      text: "",
      style: {
        fill: 0xdddddd,
        fontFamily: "RobotoMono",
        fontSize: 30,
        fontWeight: "700",
      },
    });

    this.comboText.anchor.set(0.5);
    this.comboText.zIndex = 99;

    this.notesContainer.addChild(this.comboText);
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

    this.accuracyText = new Text({
      text: "100.00%",
      style,
    });

    this.accuracyText.anchor.set(1, 0);
    this.accuracyText.y = 105;

    this.app.stage.addChild(this.accuracyText);
  }

  private addNotesContainer() {
    const width = this.difficulty.keyCount * this.skinManiaIni.ColumnWidth;

    this.app.stage.addChild(this.notesContainer);

    this.stageBackground = new Graphics()
      .rect(0, 0, width, this.app.screen.height)
      .fill(0x000000);
    this.stageBackground.alpha = 0.5;
    this.notesContainer.addChild(this.stageBackground);

    const stageSideWidth = 10;

    this.stageSides = new Graphics()
      .rect(-stageSideWidth, 0, stageSideWidth, this.app.screen.height)
      .rect(width, 0, stageSideWidth, this.app.screen.height)
      .fill(0x7f7f7f);
    this.notesContainer.addChild(this.stageSides);

    this.notesContainer.pivot.x = this.notesContainer.width / 2;

    this.notesContainer.sortableChildren = true;
  }

  private addStageLights() {
    for (let i = 0; i < this.difficulty.keyCount; i++) {
      const stageLight = new StageLight(this, i);
      scaleEntityWidth(stageLight.sprite, this.skinManiaIni.ColumnWidth);
      stageLight.sprite.anchor.set(0, 1);

      stageLight.sprite.x = i * this.skinManiaIni.ColumnWidth;

      this.notesContainer.addChild(stageLight.sprite);
      this.stageLights.push(stageLight);
    }
  }

  private addStageHint() {
    const width = this.difficulty.keyCount * this.skinManiaIni.ColumnWidth;

    this.stageHint = Sprite.from(TEXTURES.STAGE_HINT);
    this.stageHint.width = width;
    this.stageHint.anchor.set(0, 0.5);
    this.stageHint.zIndex = 2;
    this.notesContainer.addChild(this.stageHint);
  }

  private addKeys() {
    for (let i = 0; i < this.difficulty.keyCount; i++) {
      const key = new Key(this, i);
      key.sprite.width = this.skinManiaIni.ColumnWidth;

      // No idea how the height is determined in the skin.ini so Imma hardcode it
      key.sprite.height = 600;

      key.sprite.anchor.set(undefined, 1);

      key.sprite.x = i * this.skinManiaIni.ColumnWidth;

      key.sprite.zIndex = 99;

      this.notesContainer.addChild(key.sprite);
      this.keys.push(key);
    }
  }

  private addHitObjects() {
    const hitObjects = this.hitObjects.map((hitObjectData) => {
      if (hitObjectData.type === "tap") {
        const hitObject = new Tap(this, hitObjectData);
        return hitObject;
      } else {
        const hitObject = new Hold(this, hitObjectData);
        return hitObject;
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

    this.notesContainer.addChild(this.judgement.sprite);
  }

  private addFpsCounter() {
    this.fps = new Fps(this);
    this.app.stage.addChild(this.fps.view);
  }

  private addStartMessage() {
    this.startMessage = new Container();

    const text = new Text({
      text: "Press [Spacebar] to Start",
      style: {
        fill: 0xdddddd,
        fontFamily: "VarelaRound",
        fontSize: 30,
        fontWeight: "400",
        lineHeight: 0,
      },
    });

    this.startMessage.addChild(text);

    this.startMessage.pivot.set(
      this.startMessage.width / 2,
      this.startMessage.height / 2,
    );
    this.startMessage.x = this.app.screen.width / 2;
    this.startMessage.y = this.app.screen.height / 2;

    this.app.stage.addChild(this.startMessage);
  }

  public pause() {
    this.song.pause();
    this.state = "PAUSE";
  }

  public async play() {
    this.song.play();
    this.state = "PLAY";
  }
}
