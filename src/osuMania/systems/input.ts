import { Game } from "../game";

export class InputSystem {
  private game: Game;
  private keybindsMap: Map<string, number>;

  public tappedKeys: Set<string> = new Set();
  public pressedKeys: Set<string> = new Set();
  public releasedKeys: Set<string> = new Set();

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
      } else if (!button.pressed && this.gamepadState[i]) {
        this.pressedColumns[column] = false;
        this.releasedColumns[column] = true;
      }
    });

    this.gamepadState = gamepad.buttons.map((button) => button.pressed);
  }

  public handleKeyDown(event: KeyboardEvent) {
    if (this.pressedKeys.has(event.code)) {
      return;
    }

    console.log("keydown", performance.now());

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

    if (this.game.state === "PLAY") {
      this.game.columns[column][0]?.hit();
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

    if (this.game.state === "PLAY") {
      this.game.columns[column][0]?.release();
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
