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
    this.ReplayData.data.inputs.push(input);
  }
}

// Player
export class ReplayPlayer {
  private game: Game;

  public isreplay: boolean;

  constructor(game: Game) {
    this.game = game;
    this.game.isreplay = true;

  }
}
