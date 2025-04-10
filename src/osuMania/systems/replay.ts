import { Game } from "../game";
import { BeatmapData, HitObject, HitWindows } from "@/lib/beatmapParser";
import { Settings } from "@/components/providers/settingsProvider";

// Types
export type ReplayData = {
  beatmapData: {
    beatmapId: string;
    beatmapSetId: string;
  }
  usersettings: {
    audioOffset: number;
    hitPositionOffset: number;
    mods: Settings["mods"];
  }
  data: {
    inputs: ReplayInput[];
  };
};

export type ReplayInput = {
  column: number;
  time: { d: number; u: number };
  source: "Tap" | "Hold";
};
type KeyTimeRecord = {
  d: number;
  u?: number;
  source?: "Tap" | "Hold";
};

// Recorder
export class ReplayRecorder {
  private game: Game;

  public ReplayData: ReplayData;
  public keyTimes: Record<number, KeyTimeRecord> = {};

  public BeatmapData: JSON;

  constructor(game: Game) {
    this.game = game;
    
  }

  public init(beatmapData: BeatmapData, settings: Settings) {
    if (this.game.settings.mods.autoplay) {
      return
    }
    
    this.ReplayData = {
      beatmapData: {
        beatmapId: beatmapData.beatmapId,
        beatmapSetId: beatmapData.beatmapSetId,
      },
      usersettings: {
        audioOffset: settings.audioOffset,
        hitPositionOffset: settings.hitPositionOffset,
        mods: settings.mods,
      },
      data: {
        inputs: [],
      },
    };
  }

  public record(column: number, isDown: boolean, source: "Tap" | "Hold") {
    if (!this.game.record) return;
  
    if (isDown) {
      this.keyTimes[column] = {
        d: this.game.timeElapsed,
        source: source,
      };
    } else if (this.keyTimes[column]) {
      this.keyTimes[column].u = this.game.timeElapsed;
  
      this.recordInput({
        column,
        time: {
          d: this.keyTimes[column].d,
          u: this.keyTimes[column].u!,
        },
        source: this.keyTimes[column].source!,
      });
  
      delete this.keyTimes[column];
    }
  }
  public recordInput(input: ReplayInput) {
    this.ReplayData.data.inputs.push(input);
  }
}

// Player
export class ReplayPlayer {
  private game: Game;
  private events: { time: number; type: 'down' | 'up'; column: number; source: number }[] = [];
  private currentEventIndex = 0;

  constructor(game: Game) {
    this.game = game;
    const inputs = this.game.replayData?.data?.inputs || [];

    for (const input of inputs) {
      const { column, time, source } = input;
      
      const sourcen = source === 'Tap' ? 0 : 1;

      this.events.push({ column, time: time.d, type: 'down', source: sourcen });
      this.events.push({ column, time: time.u, type: 'up', source: sourcen });
    }

    this.events.sort((a, b) => a.time - b.time);
  }

  update() {
    const currentTime = this.game.timeElapsed;

    while (
      this.currentEventIndex < this.events.length &&
      this.events[this.currentEventIndex].time <= currentTime
    ) {
      const event = this.events[this.currentEventIndex];
      this.currentEventIndex++;

      const column = this.game.columns[event.column];
      const source = event.source;
      const type   = event.type;

      if (column && column[source]) {
        if (type === "down") {
          column[source].hit();
          this.game.inputSystem.tappedColumns[event.column] = true;
          this.game.inputSystem.pressedColumns[event.column] = true;
          this.game.inputSystem.releasedColumns[event.column] = false;
        } else {
          column[source].release();
          this.game.inputSystem.tappedColumns[event.column] = false;
          this.game.inputSystem.pressedColumns[event.column] = false;
          this.game.inputSystem.releasedColumns[event.column] = true;
        }
      }
    }
  }
}
