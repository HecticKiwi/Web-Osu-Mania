import type { SampleSet, TapData } from "@/lib/beatmapParser";
import type { Container, Texture } from "pixi.js";
import type { Game } from "../../game";
import { Hold } from "../hold/hold";

export abstract class Tap {
  static renderTexture: Texture | null;

  public game: Game;

  public view: Container;

  public data: TapData;
  public sampleSet: SampleSet;
  public additionSet: SampleSet;
  public sampleIndex: number;
  public volume: number;

  constructor(game: Game, tapData: TapData) {
    this.game = game;

    this.data = tapData;

    this.setSoundData();
  }

  private setSoundData() {
    const timingPoint = this.game.timingPoints.find(
      (tp) => this.data.time >= tp.time,
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

  public update(timeElapsedOverride?: number) {
    const timeElapsed = timeElapsedOverride ?? this.game.timeElapsed;
    const delta = this.data.time - timeElapsed;

    this.view.visible = true;
    this.view.y =
      this.game.hitPosition +
      this.game.settings.noteOffset -
      this.game.getHitObjectOffset(timeElapsed, this.data.time);

    // If this has passed the late miss point
    if (delta < -this.game.hitWindows[0]) {
      this.game.scoreSystem.hit(0, "late", this.data.isHoldHead);
      this.game.timelineData.push({
        time: this.data.time + this.game.hitWindows[0],
        error: -this.game.hitWindows[0],
        judgement: 0,
        health: this.game.healthSystem.health,
      });

      this.game.currentColumnIndices[this.data.column]++;
      this.view.visible = false;

      const nextHitObject = this.game.getNextHitObject(this.data.column);
      if (nextHitObject && nextHitObject instanceof Hold) {
        nextHitObject.break();
      }
    }
  }

  public hit(timeElapsedOverride?: number) {
    const timeElapsed = timeElapsedOverride ?? this.game.timeElapsed;
    const delta = this.data.time - timeElapsed;

    const absDelta = Math.abs(delta);

    // Return if you pressed way too early...
    if (absDelta > this.game.hitWindows[0]) {
      return;
    }

    const judgement =
      absDelta <= this.game.hitWindows[320]
        ? 320
        : absDelta <= this.game.hitWindows[300]
          ? 300
          : absDelta <= this.game.hitWindows[200]
            ? 200
            : absDelta <= this.game.hitWindows[100]
              ? 100
              : absDelta <= this.game.hitWindows[50]
                ? 50
                : 0;

    const earlyOrLate = delta > 0 ? "early" : "late";

    this.game.scoreSystem.hitErrors.push({ error: delta, judgement });
    this.game.scoreSystem.hit(judgement, earlyOrLate, this.data.isHoldHead);
    this.game.timelineData.push({
      time: timeElapsed,
      error: delta,
      judgement,
      health: this.game.healthSystem.health,
    });

    this.game.currentColumnIndices[this.data.column]++;
    this.view.visible = false;

    this.game.errorBar?.addTimingMark(delta);
  }

  public release() {}
}
