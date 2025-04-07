import { nothing } from "immer";
import { Game } from "../game";
import { ReplayRecorder, ReplayPlayer } from "./replay"

export class InputSystem {
  private game: Game;
  private keybindsMap: Map<string, number>;

  public tappedKeys: Set<string> = new Set();
  public pressedKeys: Set<string> = new Set();
  public releasedKeys: Set<string> = new Set();

  public ReplayRecorder?: ReplayRecorder | null = null;
  public ReplayPlayer?: ReplayPlayer | null = null;

  public gamepadState: boolean[] = [];

  public tappedColumns: boolean[];
  public pressedColumns: boolean[];
  public releasedColumns: boolean[];

  public pauseTapped: boolean = false;

  public keyTimes: Record<string, { d: number; u: number | undefined }> = {};


  constructor(game: Game) {
    this.game = game;
    this.keybindsMap = new Map();
    this.initKeybindsMap();

    this.tappedColumns = new Array(this.game.difficulty.keyCount).fill(false);
    this.pressedColumns = new Array(this.game.difficulty.keyCount).fill(false);
    this.releasedColumns = new Array(this.game.difficulty.keyCount).fill(false);

    if (this.game.record == true) {
      this.ReplayRecorder = new ReplayRecorder(this.game);
    }
    if (this.game.isGameReplay == true) {
      this.ReplayPlayer = new ReplayPlayer(this.game);
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    document.addEventListener("keydown", this.handleKeyDown, { passive: true });
    document.addEventListener("keyup", this.handleKeyUp, { passive: true });
  }

  public dispose() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  private initKeybindsMap() {
    if (this.game.isGameReplay) {
      const keybinds =
        this.game.replayData?.usersettings.keybinds.keyModes[this.game.difficulty.keyCount - 1];
        keybinds?.forEach((key, index) => {
        if (key) {
          this.keybindsMap.set(key, index);
        }
      });
    } else {
      const keybinds =
        this.game.settings.keybinds.keyModes[this.game.difficulty.keyCount - 1];
        keybinds.forEach((key, index) => {
        if (key) {
          this.keybindsMap.set(key, index);
        }
      });
    }
  }

  public updateGamepadInputs() {
    const gamepad = navigator.getGamepads().find((gp) => gp !== null) || null;
    if (!gamepad) return;

    gamepad.buttons.forEach((button, i) => {
      if (
        button.pressed &&
        this.game.settings.keybinds.pause === `🎮Btn${i}` &&
        !this.gamepadState[i]
      ) {
        this.pauseTapped = true;
      }

      const column = this.keybindsMap.get(`🎮Btn${i}`);
      if (column === undefined) return;

      if (button.pressed && !this.gamepadState[i]) {
        this.tappedColumns[column] = true;
        this.pressedColumns[column] = true;

        if (this.game.state === "PLAY" && !this.game.settings.mods.autoplay) {
          this.game.columns[column][0]?.hit();
        }
      } else if (!button.pressed && this.gamepadState[i]) {
        this.pressedColumns[column] = false;
        this.releasedColumns[column] = true;

        if (this.game.state === "PLAY" && !this.game.settings.mods.autoplay) {
          this.game.columns[column][0]?.release();
        }
      }
    });

    this.gamepadState = gamepad.buttons.map((button) => button.pressed);
  }

  public handleKeyDown(event: KeyboardEvent, codesent: boolean = false) {
    if (this.pressedKeys.has(event.code) || (this.game.isGameReplay && !codesent)) {
      if (event.code === "Escape") {
        nothing;
      } else {
        return;
      }
    }

    this.tappedKeys.add(event.code);
    this.pressedKeys.add(event.code);

    if (
      event.code === "Escape" ||
      event.code === this.game.settings.keybinds.pause
    ) {
      this.pauseTapped = true;
      return;
    }

    const column = this.keybindsMap.get(event.code);
    if (column === undefined) {
      return;
    }

    this.tappedColumns[column] = true;
    this.pressedColumns[column] = true;

    if (this.game.state === "PLAY" && !this.game.settings.mods.autoplay) {
      this.game.columns[column][0]?.hit();
    }

    if (this.game.record) {
      this.keyTimes[event.code] = { d: this.game.timeElapsed, u: undefined };
    }    
  }

  public handleKeyUp(event: KeyboardEvent) {
    
    this.pressedKeys.delete(event.code);
    this.releasedKeys.add(event.code);

    if (this.game.settings.keybinds.pause === event.code) {
      this.pauseTapped = false;
    }

    const column = this.keybindsMap.get(event.code);
    if (column === undefined) {
      return;
    }

    this.tappedColumns[column] = false;
    this.pressedColumns[column] = false;
    this.releasedColumns[column] = true;

    if (this.game.state === "PLAY" && !this.game.settings.mods.autoplay) {
      this.game.columns[column][0]?.release();
    }

    if (this.game.record && this.keyTimes[event.code]) {
      this.keyTimes[event.code].u = this.game.timeElapsed;

      this.game.replayRecorder?.recordInput({
        key: event.code,
        time: { d: this.keyTimes[event.code].d, u: this.keyTimes[event.code].u },
      });
      delete this.keyTimes[event.code];
    }
  }

  public anyKeyTapped() {
    return this.tappedColumns.some((value) => value);
  }

  public clearInputs() {
    this.tappedKeys.clear();
    this.releasedKeys.clear();

    this.tappedColumns.fill(false);
    this.releasedColumns.fill(false);

    this.pauseTapped = false;
  }
}
