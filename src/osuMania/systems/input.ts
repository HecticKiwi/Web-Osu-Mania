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
    if (this.pressedKeys.get(event.key) !== true) {
      this.pressedKeys.set(event.key, true);
      this.tappedKeys.set(event.key, true);
    }
  }

  public handleKeyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.key);
    this.tappedKeys.delete(event.key);
    this.releasedKeys.set(event.key, true);
  }

  public clearInputs() {
    this.tappedKeys.clear();
    this.releasedKeys.clear();
  }
}
