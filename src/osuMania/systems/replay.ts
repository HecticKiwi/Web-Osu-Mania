import { Game } from "../game";
import { BeatmapData, HitObject, HitWindows } from "@/lib/beatmapParser";
import { Settings } from "@/components/providers/settingsProvider";
import { InputSystem } from "./input";

// Types
export type ReplayData = {
  beatmapData: {
    beatmapId: string;
    beatmapSetId: string;
  }
  usersettings: {
    audioOffset: number;
    hitPositionOffset: number;
    keybinds: Settings["keybinds"];
    mods: Settings["mods"];
  }
  data: {
    inputs: replayinput[];
  };
};

export type replayinput = {
  key: string;
  time: {
    d: number;
    u: number | undefined;
  }
};

export type ReplayEvent = {
  time: number;
  type: 'down' | 'up';
  key: string;
};

// Recorder
export class ReplayRecorder {
  private game: Game;

  public ReplayData: ReplayData;

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
        keybinds: settings.keybinds,
        mods: settings.mods,
      },
      data: {
        inputs: [],
      },
    };
  }

  public recordInput(input: replayinput) {    
    console.log("recordInput called with:", input);
    this.ReplayData.data.inputs.push(input);
    console.log("ReplayData:", this.ReplayData.data.inputs);
  } 
}

export class ReplayPlayer {
  private game: Game;
  private activeKeys: Set<string> = new Set();
  private events: ReplayEvent[] = [];
  private currentEventIndex = 0;

  constructor(game: Game) {
    this.game = game;
    const inputs = this.game.replayData?.data?.inputs || [];

    // Flatten each input into two events: down and up
    for (const input of inputs) {
      const { key, time } = input;
      this.events.push({ key, time: time.d, type: 'down' });

      if (time.u !== undefined) {
        this.events.push({ key, time: time.u, type: 'up' });
      }
    }

    // Sort all events chronologically
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

      const keyboardEvent = new KeyboardEvent(event.type === 'down' ? 'keydown' : 'keyup', {
        code: event.key,
      });

      if (event.type === 'down') {
        if (!this.activeKeys.has(event.key)) {
          this.activeKeys.add(event.key);
          this.game.inputSystem.handleKeyDown(keyboardEvent, true);
        }
      } else {
        if (this.activeKeys.has(event.key)) {
          this.activeKeys.delete(event.key);
          this.game.inputSystem.handleKeyUp(keyboardEvent);
        }
      }
    }
  }
}
