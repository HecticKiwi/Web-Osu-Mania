import {
  BeatmapSetRecord,
  HitObject as HitObjectData,
  TYPE,
} from "@/lib/beatmapParser";
import { processIniString } from "@/lib/utils";
import {
  BeatmapConfig,
  Column,
  GameState,
  HitWindows,
  Judgement as JudgementValue,
  Results,
} from "@/types";
import { Howl } from "howler";
import { parse } from "ini";
import { Application, Container, Graphics, Text, Ticker } from "pixi.js";
import { loadAssets } from "./assets";
import {
  COLUMN_KEYS_ARRAY,
  TEXTURES,
  config,
  getHitWindows,
  scaleWidth,
} from "./constants";
import { ScoreSystem } from "./score";
import { Entity } from "./sprites/entity";
import { ErrorBar } from "./sprites/errorBar";
import { HitObject } from "./sprites/hitObject";
import { Hold } from "./sprites/hold";
import { Judgement } from "./sprites/judgement";
import { Key } from "./sprites/key";
import { StageLight } from "./sprites/stageLight";
import { Tail } from "./sprites/tail";
import { Tap } from "./sprites/tap";
import { InputSystem } from "./input";
import { Settings } from "@/components/providers/settingsProvider";

export class Game {
  public app = new Application();
  public state: GameState = "WAIT";

  public settings: Settings;

  public config = {
    columnWidth: 56,
    columnCount: 4,
    columnKeys: COLUMN_KEYS_ARRAY[4],
    hitPosition: 420,
    od: 5,
    scrollSpeed: 20,
    backgroundDim: 0.75,
    autoplay: false,
    playbackRate: 1,
  };

  public beatmapConfig: BeatmapConfig;

  public skinIni: any; // https://osu.ppy.sh/wiki/en/Skinning/skin.ini#[mania]
  public skinManiaIni: any;

  // Systems
  public scoreSystem: ScoreSystem;
  public inputSystem: InputSystem;

  public hitWindows: HitWindows;
  public totalHitObjects: number;

  // UI Components
  public columns: Column[] = [];
  private scoreText: Text;
  private comboText: Text;
  private accuracyText: Text;
  private hitObjects: HitObjectData[];
  public notesContainer: Container = new Container();
  public stageLights: StageLight[] = [];
  public keys: Key[] = [];
  public judgement: Judgement;
  private progressBarContainer: Container;
  private progressBar: Container;
  public hitError: ErrorBar;

  // Sounds
  private song: Howl;
  public hitSound: Howl;

  public timeElapsed: number = 0;

  // Judgement counts
  public 320 = 0;
  public 300 = 0;
  public 200 = 0;
  public 100 = 0;
  public 50 = 0;
  public 0 = 0;

  public score = 0;
  public combo = 0;
  public maxCombo = 0;
  public accuracy = 1;

  public constructor(
    mapData: BeatmapSetRecord,
    setResults: (results: Results) => void,
  ) {
    this.hitObjects = mapData.map;

    this.totalHitObjects = this.hitObjects.filter(
      (hitObject) =>
        hitObject.type === TYPE.TAP || hitObject.type === TYPE.HOLD_TAIL,
    ).length;

    // Set settings from localstorage
    const settings = localStorage.getItem("settings");
    if (!settings) {
      throw new Error("Settings not found");
    }

    this.settings = JSON.parse(settings);

    this.beatmapConfig = mapData.beatmapConfig;

    this.scoreSystem = new ScoreSystem(this.totalHitObjects);
    this.inputSystem = new InputSystem();

    this.song = new Howl({
      src: [mapData.audio.url],
      format: "wav",
      preload: true,
      rate: this.settings.playbackRate,
      onloaderror: (id, error) => {
        console.log(id);
        console.log(error);
      },
      onend: async () => {
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
          score: this.score,
          320: this[320],
          300: this[300],
          200: this[200],
          100: this[100],
          50: this[50],
          0: this[0],
          accuracy: this.accuracy,
          maxCombo: this.maxCombo,
        });
      },
    });

    this.hitSound = new Howl({
      src: ["/skin/normal-hitnormal.wav"],
      format: "mp3",
      preload: true,
      volume: 0.25,
    });

    this.hitWindows = getHitWindows(this.beatmapConfig.od);
  }

  public dispose() {
    this.inputSystem.dispose();

    this.app.destroy({ removeView: true });
  }

  async main(ref: HTMLDivElement) {
    const iniString = await fetch("/skin/skin.ini")
      .then((response) => response.text())
      .then((text) => processIniString(text));

    this.skinIni = parse(iniString, { bracketedArray: true });
    this.skinManiaIni = this.skinIni[`Mania${this.beatmapConfig.columnCount}`];

    console.log(this.skinManiaIni.ColumnWidth);

    this.skinManiaIni.ColumnWidth = scaleWidth(
      this.skinManiaIni.ColumnWidth.split(",")[0],
      this.app.screen.width,
    );

    await this.app.init({
      backgroundAlpha: 0,
      resizeTo: ref,
    });

    ref.appendChild(this.app.canvas);

    await loadAssets();

    this.addScoreText();

    this.addNotesContainer();

    this.addComboText();

    this.addAccuracyText();

    this.addStageLights();

    this.addStageHint();

    this.addKeys();

    this.addHitObjects();

    this.addJudgement();

    this.addProgressBar();

    this.addHitError();

    // Game loop
    this.app.ticker.add((time) => this.update(time));
  }

  private update(time: Ticker) {
    switch (this.state) {
      case "WAIT":
        if (this.inputSystem.tappedKeys.has(" ")) {
          this.song.play();
          this.state = "PLAY";
        }

        break;

      case "PLAY":
        this.timeElapsed = this.song.seek() * 1000;

        const progress = this.timeElapsed / 1000 / this.song.duration();

        this.progressBar.width = progress * 400;

        this.stageLights.forEach((stageLight) =>
          stageLight.update(time.deltaMS),
        );

        this.keys.forEach((key) => key.update(time.deltaMS));

        this.columns.forEach((column) => {
          const itemsToRemove: HitObject[] = [];

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
              this.notesContainer.removeChild(itemToRemove.sprite);
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
  }

  public hit(judgement: JudgementValue) {
    this.score += this.scoreSystem.getScoreToAdd(judgement);

    this[judgement]++;
    this.judgement.showJudgement(judgement);

    if (judgement === 0) {
      this.combo = 0;
      this.comboText.text = this.combo;
      this.comboText.visible = false;
    } else {
      this.combo++;
      this.comboText.visible = true;

      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      this.comboText.text = this.combo;
      this.scoreText.text = Math.round(this.score);
    }

    // Calculate new accuracy
    // https://osu.ppy.sh/wiki/en/Gameplay/Accuracy
    const accuracyWeight =
      300 * (this[320] + this[300]) +
      200 * this[200] +
      100 * this[100] +
      50 * this[50];

    const highestPossibleAccuracyWeight =
      300 * (this[320] + this[300] + this[200] + this[100] + this[0]);

    this.accuracy = accuracyWeight / highestPossibleAccuracyWeight;
    this.accuracyText.text = `${(this.accuracy * 100).toFixed(2)}%`;
  }

  private addProgressBar() {
    const fullWidth = 400;
    const progressBarBg = new Graphics()
      .rect(0, 0, fullWidth, 5)
      .fill(0xffffff);
    progressBarBg.alpha = 0.1;

    this.progressBar = new Graphics().rect(0, 0, 0.01, 5).fill(0xffffff);

    this.progressBarContainer = new Container();
    this.progressBarContainer.addChild(progressBarBg);
    this.progressBarContainer.addChild(this.progressBar);

    this.progressBarContainer.pivot.set(fullWidth, 0);
    this.progressBarContainer.x = this.app.screen.width - 30;
    this.progressBarContainer.y = 95;

    this.app.stage.addChild(this.progressBarContainer);
  }

  private addHitError() {
    this.hitError = new ErrorBar(this);

    this.hitError.container.x = this.app.screen.width / 2;
    this.hitError.container.y = this.app.screen.height;

    this.app.stage.addChild(this.hitError.container);
  }

  private addScoreText() {
    this.scoreText = new Text({
      text: "00000000",
      style: {
        fill: 0xdddddd,
        fontFamily: "RobotoMono",
        fontSize: 50,
        fontWeight: "400",
      },
    });

    this.scoreText.anchor.set(1, 0);
    this.scoreText.x = this.app.screen.width - 30;
    this.scoreText.y = 30;

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
    this.comboText.x = this.notesContainer.width / 2;
    this.comboText.y = this.app.screen.height / 3 + 50;
    this.comboText.zIndex = 99;

    this.notesContainer.addChild(this.comboText);
  }

  private addAccuracyText() {
    this.accuracyText = new Text({
      text: "100.00%",
      style: {
        fill: 0xdddddd,
        fontFamily: "Courier New",
        fontSize: 30,
        fontWeight: "700",
      },
    });

    this.accuracyText.anchor.set(1, 0);
    this.accuracyText.x = this.app.screen.width - 30;
    this.accuracyText.y = 105;

    this.app.stage.addChild(this.accuracyText);
  }

  private addNotesContainer() {
    this.app.stage.addChild(this.notesContainer);
    this.notesContainer.width =
      this.beatmapConfig.columnCount * config.columnWidth;

    const stageLeft = new Entity(this, TEXTURES.STAGE_LEFT);
    stageLeft.sprite.height = this.app.screen.height;
    this.notesContainer.addChild(stageLeft.sprite);

    const stageRight = new Entity(this, TEXTURES.STAGE_RIGHT);
    stageLeft.sprite.x = this.beatmapConfig.columnCount * config.columnWidth;
    stageRight.sprite.height = this.app.screen.height;
    this.notesContainer.addChild(stageRight.sprite);

    this.notesContainer.pivot.x = this.notesContainer.width / 2;
    this.notesContainer.x = this.app.screen.width / 2;

    this.notesContainer.sortableChildren = true;
  }

  private addStageLights() {
    for (let i = 0; i < this.beatmapConfig.columnCount; i++) {
      const stageLight = new StageLight(this, i);
      stageLight.scaleToWidth(config.columnWidth);
      stageLight.sprite.anchor.set(0, 1);

      stageLight.sprite.x = i * config.columnWidth;
      stageLight.sprite.y = config.hitPosition;

      this.notesContainer.addChild(stageLight.sprite);
      this.stageLights.push(stageLight);
    }
  }

  private addStageHint() {
    const stageHint = new Entity(this, TEXTURES.STAGE_HINT);
    stageHint.sprite.width = this.notesContainer.width;
    stageHint.sprite.anchor.set(0, 0.5);
    stageHint.sprite.y = config.hitPosition;
    this.notesContainer.addChild(stageHint.sprite);
  }

  private addKeys() {
    for (let i = 0; i < this.beatmapConfig.columnCount; i++) {
      const key = new Key(this, i);
      key.scaleToWidth(config.columnWidth);

      key.sprite.anchor.set(undefined, 1);
      key.sprite.y = this.app.screen.height;

      key.sprite.x = i * config.columnWidth;

      key.sprite.zIndex = 99;

      this.notesContainer.addChild(key.sprite);
      this.keys.push(key);
    }
  }

  private addHitObjects() {
    const hitObjects = this.hitObjects.map((hitObjectData) => {
      if (hitObjectData.type === TYPE.TAP) {
        const hitObject = new Tap(this, hitObjectData);
        return hitObject;
      } else if (hitObjectData.type === TYPE.HOLD_BODY) {
        const hitObject = new Hold(this, hitObjectData);
        return hitObject;
      } else {
        const hitObject = new Tail(this, hitObjectData);
        return hitObject;
      }
    });

    for (let i = 0; i < this.beatmapConfig.columnCount; i++) {
      this.columns.push(
        hitObjects.filter((hitObject) => hitObject.data.column === i),
      );
    }
  }

  private addJudgement() {
    this.judgement = new Judgement(this);
    this.judgement.sprite.anchor.set(0.5);

    this.judgement.sprite.x = this.notesContainer.width / 2;
    this.judgement.sprite.y = this.app.screen.height / 3;

    this.notesContainer.addChild(this.judgement.sprite);
  }

  public pause() {
    this.song.pause();
    this.state = "PAUSE";
  }

  public play() {
    this.song.play();
    this.state = "PLAY";
  }
}
