import { clamp } from "@/lib/utils";
import { Judgement } from "@/types";

const maxScore = 1_000_000;

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
  private bonus = 100;
  private totalHitObjects: number;

  constructor(totalHitObjects: number) {
    this.totalHitObjects = totalHitObjects;
  }

  // https://osu.ppy.sh/wiki/en/Gameplay/Score/ScoreV1/osu%21mania
  public getScoreToAdd(judgement: Judgement) {
    const baseScore = ((maxScore / 2 / this.totalHitObjects) * judgement) / 320;

    this.bonus = clamp(this.bonus + hitBonusChange[judgement], 0, 100);

    const bonusScore =
      ((maxScore / 2 / this.totalHitObjects) *
        hitBonusValue[judgement] *
        Math.sqrt(this.bonus)) /
      320;

    return baseScore + bonusScore;
  }
}
