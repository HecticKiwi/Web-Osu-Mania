import { Game } from "../game";

export class InputSystem {
  private game: Game;
  private keybinds: string[];

  public tappedKeys: Map<string, boolean> = new Map();
  public pressedKeys: Map<string, boolean> = new Map();
  public releasedKeys: Map<string, boolean> = new Map();

  public tappedColumns: boolean[];
  public pressedColumns: boolean[];
  public releasedColumns: boolean[];

  constructor(game: Game) {
    this.game = game;
    this.keybinds =
      this.game.settings.keybinds.keyModes[this.game.difficulty.keyCount - 1];

    this.tappedColumns = new Array(this.game.difficulty.keyCount).fill(false);
    this.pressedColumns = new Array(this.game.difficulty.keyCount).fill(false);
    this.releasedColumns = new Array(this.game.difficulty.keyCount).fill(false);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  public dispose() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  public handleKeyDown(event: KeyboardEvent) {
    if (!this.pressedKeys.has(event.code)) {
      this.tappedKeys.set(event.code, true);
      this.pressedKeys.set(event.code, true);

      const column = this.keybinds.indexOf(event.code);
      if (column !== -1) {
        this.tappedColumns[column] = true;
        this.pressedColumns[column] = true;
      }
    }
  }

  public handleKeyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.code);
    this.releasedKeys.set(event.code, true);

    const column = this.keybinds.indexOf(event.code);
    if (column !== -1) {
      this.tappedColumns[column] = false;
      this.pressedColumns[column] = false;
      this.releasedColumns[column] = true;
    }
  }

  public clearInputs() {
    this.tappedKeys.clear();
    this.releasedKeys.clear();

    this.tappedColumns.fill(false);
    this.releasedColumns.fill(false);
  }
}
