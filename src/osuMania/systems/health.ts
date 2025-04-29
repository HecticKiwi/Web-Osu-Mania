import { clamp } from "@/lib/math";
import { Judgement } from "@/types";
import { Game } from "../game";

// Default Val: https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Judgements/Judgement.cs#L18
// Note Heal / Drain: https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Judgements/ManiaJudgement.cs

export const MIN_HEALTH = 0;
export const MAX_HEALTH = 1;
const MAX_HEALTH_INCREASE = 0.05;

const hitHPValue: { [key in Judgement]: number } = {
  320: MAX_HEALTH_INCREASE, // Perfect
  300: MAX_HEALTH_INCREASE * 0.3, // Great
  200: MAX_HEALTH_INCREASE * 0.1, // Good
  100: -MAX_HEALTH_INCREASE * 0.3, // Ok
  50: -MAX_HEALTH_INCREASE * 0.5, // Meh
  0: -MAX_HEALTH_INCREASE, // Miss
};

export class HealthSystem {
  private game: Game;

  // https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Scoring/HealthProcessor.cs#L27
  public health: number = MAX_HEALTH;

  constructor(game: Game) {
    this.game = game;
  }

  public hit(judgement: Judgement) {
    if (this.game.settings.mods.suddenDeath && judgement === 0) {
      this.health = MIN_HEALTH; // You die >:)
    } else {
      this.health = clamp(
        this.health + hitHPValue[judgement],
        MIN_HEALTH,
        MAX_HEALTH,
      );
    }
  }
}
