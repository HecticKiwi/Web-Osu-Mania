export class InputSystem {
  public pressedKeys: Map<string, boolean> = new Map();
  public tappedKeys: Map<string, boolean> = new Map();
  public releasedKeys: Map<string, boolean> = new Map();

  constructor() {
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
    if (this.pressedKeys.get(event.code) !== true) {
      this.pressedKeys.set(event.code, true);
      this.tappedKeys.set(event.code, true);
    }
  }

  public handleKeyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.code);
    this.tappedKeys.delete(event.code);
    this.releasedKeys.set(event.code, true);
  }

  public clearInputs() {
    this.tappedKeys.clear();
    this.releasedKeys.clear();
  }
}
