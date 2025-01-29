import { Game } from "../game";

export class InputSystem {
  private game: Game;
  private keybindsMap: Map<string, number>;

  public tappedKeys: Set<string> = new Set();
  public pressedKeys: Set<string> = new Set();
  public releasedKeys: Set<string> = new Set();

  public gamepadState: GamepadButton[] = [];

  public tappedColumns: boolean[];
  public pressedColumns: boolean[];
  public releasedColumns: boolean[];

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
      this.keybindsMap.set(key, index);
    });
  }

  public updateGamepadInputs() {
    const gamepad = navigator.getGamepads().find((gp) => gp !== null) || null;
    if (!gamepad) return;

    gamepad.buttons.forEach((button, i) => {
      const column = this.keybindsMap.get(`🎮Btn${i}`);
      if (column === undefined) return;

      if (button.pressed && !this.gamepadState[i]?.pressed) {
        this.tappedColumns[column] = true;
        this.pressedColumns[column] = true;
      } else if (!button.pressed && this.gamepadState[i]?.pressed) {
        this.pressedColumns[column] = false;
        this.releasedColumns[column] = true;
      }
    });

    this.gamepadState = [...gamepad.buttons];
  }

  public handleKeyDown(event: KeyboardEvent) {
    if (!this.pressedKeys.has(event.code)) {
      this.tappedKeys.add(event.code);
      this.pressedKeys.add(event.code);

      const column = this.keybindsMap.get(event.code);
      if (column !== undefined) {
        this.tappedColumns[column] = true;
        this.pressedColumns[column] = true;
      }
    }
  }

  public handleKeyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.code);
    this.releasedKeys.add(event.code);

    const column = this.keybindsMap.get(event.code);
    if (column !== undefined) {
      this.tappedColumns[column] = false;
      this.pressedColumns[column] = false;
      this.releasedColumns[column] = true;
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
  }
}
