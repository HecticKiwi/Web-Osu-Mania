import type { BeatmapData } from "@/lib/beatmapParser";
import type { EncodedMods } from "@/lib/replay";
import { encodeMods } from "@/lib/replay";
import type { Game } from "../game";

export type LocalBeatmapData = {
  hash: string;

  // For local beatmaps, don't rely on the beatmap ID / set ID as they may not exist.
  // Instead, use the difficulty name and keycount
  version: string;
  keyCount: number;
};

export type ApiBeatmapData = {
  hash: string;
  id: number;
  setId: number;
};

type BaseReplayData = {
  timestamp?: number;
  beatmap: LocalBeatmapData | ApiBeatmapData;
  mods: EncodedMods;
  columnMap?: number[];
};

export type ReplayData = ReplayDataV1 | ReplayDataV2;

// V1:
// - Fix audio offset
export type ReplayInputV1 = [time: number, length: number];
export type ReplayDataV1 = BaseReplayData & {
  version: undefined | 0 | 1;
  inputs: ReplayInputV1[][];
};

// V2:
// - Combine inputs columns into a single array to capture order of events pressed in the same frame
// - Remove Audio Context outputLatency in time
export type ReplayInputV2 = [column: number, time: number, isDown: boolean];
export type ReplayDataV2 = BaseReplayData & {
  version: 2;
  inputs: ReplayInputV2[];
};

export class ReplayRecorder {
  private game: Game;

  public replayData: ReplayDataV2;

  constructor(game: Game, beatmapData: BeatmapData) {
    this.game = game;

    let beatmap: LocalBeatmapData | ApiBeatmapData;
    if (beatmapData.isLocalSource) {
      beatmap = {
        hash: beatmapData.beatmapHash,
        version: beatmapData.metadata.version,
        keyCount: beatmapData.difficulty.keyCount,
      };
    } else {
      beatmap = {
        hash: beatmapData.beatmapHash,
        id: Number(beatmapData.beatmapId),
        setId: beatmapData.beatmapSetId,
      };
    }

    this.replayData = {
      version: 2,
      beatmap,
      mods: encodeMods(this.game.mods),
      inputs: [],
      columnMap: game.mods.random ? beatmapData.columnMap : undefined,
    };
  }

  public record(column: number, isDown: boolean) {
    const time = this.game.timeElapsed + this.game.audioOffset;

    this.replayData.inputs.push([column, time, isDown]);
  }
}
