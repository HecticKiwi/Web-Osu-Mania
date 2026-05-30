import type { Game } from "../game";
import type { ReplayData } from "./replayRecorder";

type Event = {
  time: number;
  type: "down" | "up";
  column: number;
};

export class ReplayPlayer {
  private game: Game;

  public replayData: ReplayData;
  private events: Event[] = [];
  public currentEventIndex = 0;

  constructor(game: Game, replayData: ReplayData) {
    this.game = game;
    this.replayData = replayData;

    if (replayData.version !== 2) {
      const inputs = replayData.inputs
        .map((columnInputs, column) =>
          columnInputs.map((input) => [column, ...input]),
        )
        .flat();

      for (const input of inputs) {
        const [column, rawTime, length] = input;
        const time =
          replayData.version && replayData.version === 1
            ? rawTime - game.settings.audioOffset
            : rawTime;

        this.events.push(
          {
            column,
            time,
            type: "down",
          },
          {
            column,
            time: time + length,
            type: "up",
          },
        );
      }
    } else {
      for (const input of replayData.inputs) {
        const [column, rawTime, isDown] = input;
        const time = rawTime - game.audioOffset;

        this.events.push({
          column,
          time,
          type: isDown ? "down" : "up",
        });
      }
    }

    this.events.sort((a, b) => a.time - b.time);
  }

  // Play all replay inputs up to the provided time
  public update(time: number, isAfterSeek?: boolean) {
    while (
      this.currentEventIndex < this.events.length &&
      this.events[this.currentEventIndex].time <= time
    ) {
      const event = this.events[this.currentEventIndex];

      if (event.type === "down") {
        this.game.inputSystem.hit(event.column, event.time, isAfterSeek);
      } else {
        this.game.inputSystem.release(event.column, event.time);
      }

      this.currentEventIndex++;
    }
  }
}
