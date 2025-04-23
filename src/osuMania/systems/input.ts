import { Game } from "../game";

export class InputSystem {
  private game: Game;
  private keybindsMap: Map<string, number>;

  public gamepadState: boolean[] = [];

  public tappedColumns: boolean[];
  public pressedColumns: boolean[];
  public releasedColumns: boolean[];

  public pauseTapped: boolean = false;

  constructor(game: Game) {
    this.game = game;
    this.keybindsMap = new Map();
    this.initKeybindsMap();

    this.tappedColumns = new Array(this.game.difficulty.keyCount).fill(false);
    this.pressedColumns = new Array(this.game.difficulty.keyCount).fill(false);
    this.releasedColumns = new Array(this.game.difficulty.keyCount).fill(false);

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
    const keybinds =
      this.game.settings.keybinds.keyModes[this.game.difficulty.keyCount - 1];
    keybinds.forEach((key, index) => {
      if (key) {
        this.keybindsMap.set(key, index);
      }
    });
  }

  public hit(column: number, timeElapsed?: number) {
    if (this.pressedColumns[column]) {
      return;
    }

    this.tappedColumns[column] = true;
    this.pressedColumns[column] = true;

    if (this.game.state !== "PLAY" || this.game.settings.mods.autoplay) {
      return;
    }

    if (!timeElapsed) {
      this.game.timeElapsed = Math.round(this.game.song.seek() * 1000);
    }

    this.game.replayRecorder?.record(column, true);
    this.game.columns[column][0]?.hit(timeElapsed);
    this.game.audioSystem.playNextHitsounds(column);
  }

  public release(column: number, timeElapsed?: number) {
    if (!this.pressedColumns[column]) {
      return;
    }

    this.pressedColumns[column] = false;
    this.releasedColumns[column] = true;

    if (this.game.state !== "PLAY" || this.game.settings.mods.autoplay) {
      return;
    }

    if (!timeElapsed) {
      this.game.timeElapsed = Math.round(this.game.song.seek() * 1000);
    }

    this.game.replayRecorder?.record(column, false);
    this.game.columns[column][0]?.release(timeElapsed);
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

      if (this.game.replayPlayer) {
        return;
      }

      const column = this.keybindsMap.get(`🎮Btn${i}`);
      if (column === undefined) {
        return;
      }

      if (button.pressed && !this.gamepadState[i]) {
        this.hit(column);
      } else if (!button.pressed && this.gamepadState[i]) {
        this.release(column);
      }
    });

    this.gamepadState = gamepad.buttons.map((button) => button.pressed);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) {
      return;
    }

    if (
      event.code === "Escape" ||
      event.code === this.game.settings.keybinds.pause
    ) {
      this.pauseTapped = true;
      return;
    }

    if (this.game.replayPlayer) {
      return;
    }

    const column = this.keybindsMap.get(event.code);
    if (column === undefined) {
      return;
    }

    this.hit(column);
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (this.game.replayPlayer) {
      return;
    }

    const column = this.keybindsMap.get(event.code);
    if (column === undefined) {
      return;
    }

    this.release(column);
  }

  public anyColumnTapped() {
    return this.tappedColumns.some((value) => value);
  }

  public clearInputs() {
    this.tappedColumns.fill(false);
    this.releasedColumns.fill(false);

    this.pauseTapped = false;
  }
}
