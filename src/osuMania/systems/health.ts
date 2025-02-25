import { Judgement } from "@/types";
import { Game } from "../game";

// If you want to modify the hp values of the player, they are in game.ts at lines 130-132

// You can change the hp drain an regen values here

/* Values taken from
  Default Val: https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Judgements/Judgement.cs#L18
  Note Heal / Drain: https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Judgements/ManiaJudgement.cs
*/
const DEFAULT_MAX_HEALTH_INCREASE = 0.05;

const hitHPValue: { [key in Judgement]: number } = {
  320: DEFAULT_MAX_HEALTH_INCREASE, // Perfect
  300: DEFAULT_MAX_HEALTH_INCREASE * 0.3, // Great
  200: DEFAULT_MAX_HEALTH_INCREASE * 0.1, // Good
  100: -DEFAULT_MAX_HEALTH_INCREASE * 0.3, // Ok
  50: -DEFAULT_MAX_HEALTH_INCREASE * 0.5, // Meh
  0: -DEFAULT_MAX_HEALTH_INCREASE, // Miss
};

const hitHPValueFC: { [key in Judgement]: number } = {
  320: 0,
  300: 0,
  200: 0,
  100: 0,
  50: 0,
  0: -1,
};

export class HealthSystem {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }
  
  public hit(judgement: Judgement) {
    if (this.game.settings.mods.fc) {
      this.game.health += hitHPValueFC[judgement];
    } else {
      this.game.health += hitHPValue[judgement];
    }


    if (this.game.health > this.game.maxhealth) {
      this.game.health = this.game.maxhealth
    }
    if (this.game.health < this.game.minhealth) {
      this.game.health = this.game.minhealth
    } 
  }
}
