import { SampleSet, TapData } from "@/lib/beatmapParser";
import {
  Container,
  Graphics,
  GraphicsContext,
  RenderTexture,
  Sprite,
} from "pixi.js";
import { colors, MAX_TIME_RANGE } from "../constants";
import { Game } from "../game";

export class Tap {
  static renderTexture: RenderTexture | null;
  static graphicsContext: GraphicsContext | null;

  public game: Game;

  public view: Container;

  public data: TapData;
  public sampleSet: SampleSet;
  public additionSet: SampleSet;
  public sampleIndex: number;
  public volume: number;
  public shouldRemove: boolean = false;

  constructor(game: Game, tapData: TapData) {
    this.game = game;

    this.data = tapData;

    let width = game.scaledColumnWidth;
    let height = width * 0.4;
    let radius = 0;

    if (this.game.settings.style === "circles") {
      width = game.scaledColumnWidth * 0.8;
      height = game.scaledColumnWidth * 0.8;
      radius = game.scaledColumnWidth * 0.8;
    }

    if (!Tap.renderTexture) {
      Tap.graphicsContext = new GraphicsContext()
        .roundRect(0, 0, width, height, radius)
        .fill("white");

      const graphic = new Graphics(Tap.graphicsContext);

      Tap.renderTexture = RenderTexture.create({
        width,
        height,
      });
      Tap.renderTexture.destroy();

      game.app.renderer.render({
        container: graphic,
        target: Tap.renderTexture,
      });
    }

    this.view = new Sprite(Tap.renderTexture);
    this.view.tint = colors[game.laneColors[tapData.column]];
    this.view.zIndex = 1;
    this.view.pivot.x = width / 2;
    this.view.pivot.y = height;
    this.view.x =
      tapData.column * game.scaledColumnWidth + game.scaledColumnWidth / 2;
    this.view.visible = false;

    if (this.game.settings.style === "circles") {
      this.view.pivot.y = height / 2;
    }

    this.game.notesContainer.addChild(this.view);

    this.setSoundData();
  }

  private setSoundData() {
    const timingPoint = this.game.timingPoints.find(
      (timingPoint) => this.data.time >= timingPoint.time,
    );

    if (!timingPoint) {
      return new Error("No timing point for hit object");
    }

    this.sampleSet =
      this.data.hitSample.normalSet !== "default"
        ? this.data.hitSample.normalSet
        : timingPoint.sampleSet;
    this.additionSet =
      this.data.hitSample.additionSet !== "default"
        ? this.data.hitSample.additionSet
        : this.sampleSet;
    this.sampleIndex = this.data.hitSample.index
      ? this.data.hitSample.index
      : timingPoint.sampleIndex;
    this.volume = this.data.hitSample.volume || timingPoint.volume;
  }

  public playHitsounds() {
    const hitSoundFile = this.data.hitSample.filename;

    if (
      !this.game.settings.ignoreBeatmapHitsounds &&
      hitSoundFile &&
      this.game.audioSystem.sounds[hitSoundFile]
    ) {
      this.game.audioSystem.play(hitSoundFile, this.game.settings.sfxVolume);
    } else {
      if (this.data.hitSound.normal) {
        this.game.audioSystem.playHitSound(
          this.sampleSet,
          this.sampleIndex,
          "normal",
          this.volume,
        );
      }

      if (this.data.hitSound.whistle) {
        this.game.audioSystem.playHitSound(
          this.additionSet,
          this.sampleIndex,
          "whistle",
          this.volume,
        );
      }

      if (this.data.hitSound.clap) {
        this.game.audioSystem.playHitSound(
          this.additionSet,
          this.sampleIndex,
          "clap",
          this.volume,
        );
      }

      if (this.data.hitSound.finish) {
        this.game.audioSystem.playHitSound(
          this.additionSet,
          this.sampleIndex,
          "finish",
          this.volume,
        );
      }
    }
  }

  public update() {
    const delta = this.data.time - this.game.timeElapsed;

    this.view.visible = true;
    this.view.y =
      (-delta * (MAX_TIME_RANGE / this.game.settings.scrollSpeed)) /
        this.game.settings.mods.playbackRate +
      this.game.hitPosition;

    const column = this.game.columns[this.data.column];
    if (column[0] !== this) {
      return;
    }

    if (this.game.settings.mods.autoplay) {
      if (delta < 0) {
        this.playHitsounds();

        this.game.scoreSystem.hit(320);
        this.game.stageLights[this.data.column]?.light();

        this.game.errorBar?.addTimingMark(0);

        this.shouldRemove = true;

        this.game.keys[this.data.column].setPressed(true);
        setTimeout(
          () => this.game.keys[this.data.column].setPressed(false),
          100,
        );
      }

      return;
    }

    // If this has passed the late miss point
    if (delta < -this.game.hitWindows[0]) {
      this.game.scoreSystem.hit(0);
      this.shouldRemove = true;
    }

    if (this.isHit()) {
      const absDelta = Math.abs(delta);

      // Return if you pressed way too early...
      if (absDelta > this.game.hitWindows[0]) {
        return;
      }

      if (absDelta <= this.game.hitWindows[320]) {
        this.game.scoreSystem.hit(320);
      } else if (absDelta < this.game.hitWindows[300]) {
        this.game.scoreSystem.hit(300);
      } else if (absDelta < this.game.hitWindows[200]) {
        this.game.scoreSystem.hit(200);
      } else if (absDelta < this.game.hitWindows[100]) {
        this.game.scoreSystem.hit(100);
      } else if (absDelta < this.game.hitWindows[50]) {
        this.game.scoreSystem.hit(50);
      } else {
        this.game.scoreSystem.hit(0);
      }

      this.game.errorBar?.addTimingMark(delta);

      this.shouldRemove = true;
    }
  }

  public isHit() {
    return this.game.inputSystem.tappedColumns[this.data.column];
  }
}
