import { BeatmapData } from "@/lib/beatmapParser";
import { EncodedMods, encodeMods } from "@/lib/replay";
import { Game } from "../game";

export type ReplayData = {
  timestamp?: number;
  beatmap: {
    id: number;
    setId: number;
  };
  mods: EncodedMods;
  inputs: ReplayInput[][];
  columnMap?: number[];
};

export type ReplayInput = [time: number, length: number];

export class ReplayRecorder {
  private game: Game;

  public replayData: ReplayData;
  private keyTimes: Record<number, number> = {};

  constructor(game: Game, beatmapData: BeatmapData) {
    this.game = game;

    this.replayData = {
      beatmap: {
        id: Number(beatmapData.beatmapId),
        setId: beatmapData.beatmapSetId,
      },
      mods: encodeMods(this.game.settings.mods),
      inputs: Array.from({ length: this.game.difficulty.keyCount }, () => []),
      columnMap: game.settings.mods.random ? beatmapData.columnMap : undefined,
    };
  }

  public record(column: number, isDown: boolean) {
    const time = this.game.timeElapsed;

    if (isDown) {
      this.keyTimes[column] = time;

      return;
    }

    if (!this.keyTimes[column]) {
      return;
    }

    this.replayData.inputs[column].push([
      this.keyTimes[column],
      time - this.keyTimes[column],
    ]);

    delete this.keyTimes[column];
  }
}
