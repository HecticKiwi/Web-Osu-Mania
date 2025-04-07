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

// Player
export class ReplayPlayer {
  private game: Game;
  public isreplay: boolean;

  constructor(game: Game) {
    this.game = game;
  }

  public press(key: string, until: number) {
    const eventDown = new KeyboardEvent("keydown", { code: key });
    this.game.inputSystem.handleKeyDown(eventDown);
  
    const duration = until - this.game.timeElapsed;
    if (duration > 0) {
      setTimeout(() => {
        const eventUp = new KeyboardEvent("keyup", { code: key });
        this.game.inputSystem.handleKeyUp(eventUp);
      }, duration);
    }
  }
  

}
