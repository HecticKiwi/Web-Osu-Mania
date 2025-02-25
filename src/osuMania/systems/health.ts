import { Judgement } from "@/types";
import { Game } from "../game";

// If you want to modify the hp values of the player, they are in game.ts at lines 130-132

const hitHPValue: { [key in Judgement]: number } = {
  320: 40,
  300: 20,
  200: 15,
  100: 5,
  50: -10,
  0: -40,
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
