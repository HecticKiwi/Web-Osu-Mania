import { HitObject } from "@/lib/beatmapParser";
import { clamp } from "@/lib/math";
import { getHpOrOdAfterMods } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import { Judgement } from "@/types";
import { Game } from "../game";

// Try to match the official osu code where convenient (some of it may be redundant but it's a lot easier to match functionality)
// https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Scoring/LegacyDrainingHealthProcessor.cs
// https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Scoring/ManiaHealthProcessor.cs

// https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Scoring/HealthProcessor.cs#L27
export const MIN_HEALTH = 0;
export const MAX_HEALTH = 1;

// https://github.com/ppy/osu/blob/cb082da0633f303c63fe093280bd1f3a6359983e/osu.Game/Beatmaps/IBeatmapDifficultyInfo.cs#L57
function difficultyRange(
  difficulty: number,
  min: number,
  mid: number,
  max: number,
) {
  if (difficulty > 5) return mid + ((max - mid) * (difficulty - 5)) / 5;
  if (difficulty < 5) return mid + ((mid - min) * (difficulty - 5)) / 5;

  return mid;
}

export class HealthSystem {
  private game: Game;

  public health: number = MAX_HEALTH;

  private hpMultiplierNormal = 1;

  constructor(game: Game) {
    this.game = game;

    this.computeDrainRate();
  }

  // Calculates hpMultiplierNormal
  private computeDrainRate() {
    const hp = getHpOrOdAfterMods(
      this.game.difficulty.hp,
      "hp",
      useSettingsStore.getState().mods,
    );

    const lowestHpEver = difficultyRange(hp, 0.975, 0.8, 0.3);
    const lowestHpEnd = difficultyRange(hp, 0.99, 0.9, 0.4);
    const hpRecoveryAvailable = difficultyRange(hp, 0.04, 0.02, 0);

    // Begins at the first hitObject
    // https://osu.ppy.sh/wiki/en/Beatmap/Drain_time
    const drainStartTime = this.game.hitObjects[0].time;

    let testDrop = 0.00025;
    let currentHp: number;
    let currentHpUncapped: number;

    const reduceHp = (amount: number) => {
      currentHpUncapped = Math.max(0, currentHpUncapped - amount);
      currentHp = Math.max(0, currentHp - amount);
    };

    const increaseHp = (hitObject: HitObject) => {
      const isHoldHead =
        hitObject.type === "tap" && hitObject.endTime !== hitObject.time;
      const isHoldTail = hitObject.type === "hold";
      const amount = this.getHealthIncreaseFor(320, isHoldHead || isHoldTail);

      currentHpUncapped += amount;
      currentHp = Math.max(0, Math.min(1, currentHp + amount));
    };

    while (true) {
      currentHp = 1;
      currentHpUncapped = 1;

      let lowestHp = currentHp;
      let lastTime = drainStartTime;
      let currentBreak = 0;
      let fail = false;
      let topLevelObjectCount = 0;

      const topLevelHitObjects = this.game.hitObjects.filter(
        (thing) => thing.type === "tap",
      );

      for (const h of topLevelHitObjects) {
        topLevelObjectCount++;

        while (
          currentBreak < this.game.breaks.length &&
          this.game.breaks[currentBreak].endTime <= h.time
        ) {
          lastTime = h.time;
          currentBreak++;
        }

        reduceHp(testDrop * (h.time - lastTime));

        lastTime = h.endTime;

        if (currentHp < lowestHp) {
          lowestHp = currentHp;
        }

        if (currentHp <= lowestHpEver) {
          fail = true;
          testDrop *= 0.96;
          break;
        }

        const hpReduction = testDrop * (h.endTime - h.time);
        const hpOverkill = Math.max(0, hpReduction - currentHp);
        reduceHp(hpReduction);

        if (h.endTime !== h.time) {
          increaseHp(h);
          increaseHp(h);
        }

        if (hpOverkill > 0 && currentHp - hpOverkill <= lowestHpEver) {
          fail = true;
          testDrop *= 0.96;
          break;
        }

        if (h.endTime === h.time) {
          increaseHp(h);
        }
      }

      if (topLevelObjectCount === 0) {
        return testDrop;
      }

      if (!fail && currentHp < lowestHpEnd) {
        fail = true;
        testDrop *= 0.94;
        this.hpMultiplierNormal *= 1.01;
      }

      const recovery =
        (currentHpUncapped - 1) / Math.max(1, topLevelObjectCount);

      if (!fail && recovery < hpRecoveryAvailable) {
        fail = true;
        testDrop *= 0.96;
        this.hpMultiplierNormal *= 1.01;
      }

      if (!fail && !Number.isFinite(this.hpMultiplierNormal)) {
        this.hpMultiplierNormal = 1;
        return 0;
      }

      if (!fail) {
        return testDrop;
      }
    }
  }

  private getHealthIncreaseFor(result: Judgement, isForHold?: boolean) {
    let increase = 0;

    const hp = this.game.difficulty.hp;

    switch (result) {
      case 0:
        if (isForHold) {
          return -(hp + 1) * 0.00375;
        }

        return -(hp + 1) * 0.0075;
      case 50:
        return -(hp + 1) * 0.0016;
      case 100:
        return 0;
      case 200:
        increase = 0.004 - hp * 0.0004;
        break;
      case 300:
        increase = 0.005 - hp * 0.0005;
        break;
      case 320:
        increase = 0.0055 - hp * 0.0005;
        break;
    }

    return this.hpMultiplierNormal * increase;
  }

  public hit(judgement: Judgement, isForHold?: boolean) {
    if (this.game.settings.mods.suddenDeath && judgement === 0) {
      this.health = MIN_HEALTH; // You die >:)
    } else {
      this.health = clamp(
        this.health + this.getHealthIncreaseFor(judgement, isForHold),
        MIN_HEALTH,
        MAX_HEALTH,
      );
    }
  }
}
