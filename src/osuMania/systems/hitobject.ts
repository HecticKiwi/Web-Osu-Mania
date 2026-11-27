import { MAX_TIME_RANGE } from "../constants";
import type { Game } from "../game";
import { MIN_HEALTH } from "./health";

export class HitObjectSystem {
  public game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public addHitObjects() {
    const hitObjects = this.game.hitObjects.map((hitObjectData) => {
      if (hitObjectData.type === "tap") {
        return new this.game.tapClass(this.game, hitObjectData);
      } else {
        return new this.game.holdClass(this.game, hitObjectData);
      }
    });

    if (this.game.stageCover) {
      hitObjects.forEach((hitObject) => {
        hitObject.view.mask = this.game.stageCover.view;
      });
    }

    for (let i = 0; i < this.game.difficulty.keyCount; i++) {
      this.game.columns.push(
        hitObjects.filter((hitObject) => hitObject.data.column === i),
      );
      this.game.currentColumnIndices.push(0);
    }
  }

  public updateHitObjects() {
    this.game.columns.forEach((column, columnIndex) => {
      let i = this.game.currentColumnIndices[columnIndex];

      while (i < column.length) {
        const hitObject = column[i];

        hitObject.update();

        // If you failed, you're done - no need to update any more hit objects
        if (
          this.game.systems.health?.health === MIN_HEALTH &&
          !this.game.mods.noFail
        ) {
          return;
        }

        // If this hit object is above the top screen edge, there's no need to update the rest
        if (hitObject.view.y < 0) {
          break;
        }

        i++;
      }
    });
  }

  public getNextHitObject(columnId: number) {
    return this.game.columns[columnId][
      this.game.currentColumnIndices[columnId]
    ];
  }

  // Returns the px offset of the hit object from the judgement line based on
  // how long it should take to reach the line
  public getHitObjectOffset(startTime: number, endTime: number) {
    if (this.game.mods.constantSpeed) {
      const speed =
        this.game.hitPosition /
        (MAX_TIME_RANGE / this.game.settings.scrollSpeed);

      const offset =
        ((endTime - startTime) * speed) / this.game.mods.playbackRate;

      return offset;
    }

    const flipped = startTime > endTime;
    if (flipped) {
      [startTime, endTime] = [endTime, startTime];
    }

    const currentTimingPointIndex = this.game.timingPoints.findIndex(
      (timingPoint) => startTime >= timingPoint.time,
    );

    let totalOffset = 0;
    for (
      let i = currentTimingPointIndex;
      i < this.game.timingPoints.length;
      i++
    ) {
      const currentTimingPoint = this.game.timingPoints[i];
      const nextTimingPoint = this.game.timingPoints[i + 1];

      const intervalStart = Math.max(currentTimingPoint.time, startTime);
      const intervalEnd = nextTimingPoint
        ? Math.min(nextTimingPoint.time, endTime)
        : endTime;

      if (intervalStart < intervalEnd) {
        const duration = intervalEnd - intervalStart;
        const speed =
          this.game.hitPosition /
          (MAX_TIME_RANGE / currentTimingPoint.scrollSpeed);

        totalOffset += (duration * speed) / this.game.mods.playbackRate;
      }
    }

    return flipped ? -totalOffset : totalOffset;
  }
}
