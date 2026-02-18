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
  private currentEventIndex = 0;

  constructor(game: Game, replayData: ReplayData) {
    this.game = game;
    const inputs = replayData.inputs
      .map((columnInputs, column) =>
        columnInputs.map((input) => [column, ...input]),
      )
      .flat();

    this.replayData = replayData;

    for (const input of inputs) {
      const [column, rawTime, length] = input;
      const time =
        replayData.version >= 1 ? rawTime - game.settings.audioOffset : rawTime;

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

    this.events.sort((a, b) => a.time - b.time);
  }

  public update() {
    const time = this.game.timeElapsed;

    while (
      this.currentEventIndex < this.events.length &&
      this.events[this.currentEventIndex].time <= time
    ) {
      const event = this.events[this.currentEventIndex];

      const type = event.type;

      if (type === "down") {
        this.game.inputSystem.hit(event.column, event.time);
      } else {
        this.game.inputSystem.release(event.column, event.time);
      }

      this.currentEventIndex++;
    }
  }
}
