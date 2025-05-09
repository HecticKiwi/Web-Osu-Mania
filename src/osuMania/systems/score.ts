import { HitError } from "@/components/game/timingDistributionChart";
import { clamp } from "@/lib/math";
import { getScoreMultiplier } from "@/lib/utils";
import { Judgement } from "@/types";
import { Game } from "../game";

const MAX_SCORE = 1_000_000;

const hitBonusValue: { [key in Judgement]: number } = {
  320: 32,
  300: 32,
  200: 16,
  100: 8,
  50: 4,
  0: 0,
};

const hitBonusChange: { [key in Judgement]: number } = {
  320: 2,
  300: 1,
  200: -8,
  100: -24,
  50: -44,
  0: -100,
};

export class ScoreSystem {
  private game: Game;

  private bonus = 100;
  private readonly totalHitObjects: number;

  public hitErrors: HitError[] = [];

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
  public multiplier: number;

  constructor(game: Game, totalHitObjects: number) {
    this.game = game;
    this.totalHitObjects = totalHitObjects;
    this.multiplier = getScoreMultiplier(game.settings.mods);
  }

  public hit(judgement: Judgement) {
    this.score += this.getScoreToAdd(judgement);

    this.game.healthSystem?.hit(judgement);

    this[judgement]++;

    if (judgement !== 320 || this.game.settings.show300g) {
      this.game.judgementToShow = judgement;
    }

    if (judgement === 0) {
      this.combo = 0;

      if (this.game.comboText) {
        this.game.comboText.text = this.combo;
        this.game.comboText.visible = false;
      }
    } else {
      this.combo++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      if (this.game.comboText) {
        this.game.comboText.visible = true;
        this.game.comboText.text = this.combo;
      }

      if (this.game.scoreText) {
        this.game.scoreText.text = Math.round(this.score);
      }
    }

    // Calculate new accuracy
    // https://osu.ppy.sh/wiki/en/Gameplay/Accuracy#osu!mania
    const accuracyWeight =
      305 * this[320] +
      300 * this[300] +
      200 * this[200] +
      100 * this[100] +
      50 * this[50];

    const highestPossibleAccuracyWeight =
      305 *
      (this[320] + this[300] + this[200] + this[100] + this[50] + this[0]);

    this.accuracy = accuracyWeight / highestPossibleAccuracyWeight;

    if (this.game.accuracyText) {
      this.game.accuracyText.text = `${(this.accuracy * 100).toFixed(2)}%`;
    }
  }

  // https://osu.ppy.sh/wiki/en/Gameplay/Score/ScoreV1/osu%21mania
  private getScoreToAdd(judgement: Judgement) {
    const baseScore =
      ((MAX_SCORE / 2 / this.totalHitObjects) * judgement) / 320;

    this.bonus = clamp(this.bonus + hitBonusChange[judgement], 0, 100);

    const bonusScore =
      ((MAX_SCORE / 2 / this.totalHitObjects) *
        hitBonusValue[judgement] *
        Math.sqrt(this.bonus)) /
      320;

    return (baseScore + bonusScore) * this.multiplier;
  }
}
