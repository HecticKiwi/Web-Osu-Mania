import type { Game } from "../game";
import type { Hold } from "../sprites/hold/hold";
import type { Tap } from "../sprites/tap/tap";

export class InputSystem {
  private game: Game;
  private keybindsMap: Map<string, number>;
  private columnPressedKeybinds: Set<string>[];

  public gamepadState: boolean[] = [];

  public tappedColumns: boolean[];
  public pressedColumns: boolean[];
  public releasedColumns: boolean[];

  public pauseTapped = false;

  constructor(game: Game) {
    this.game = game;
    this.keybindsMap = new Map();
    this.initKeybindsMap();

    this.columnPressedKeybinds = Array.from(
      { length: this.game.difficulty.keyCount },
      () => new Set(),
    );

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

  private initKeybindsMap() {
    const keybinds =
      this.game.settings.keybinds.keyModes[this.game.difficulty.keyCount - 1];
    keybinds.forEach(([keybind1, keybind2], index) => {
      if (keybind1) {
        this.keybindsMap.set(keybind1, index);
      }
      if (keybind2) {
        this.keybindsMap.set(keybind2, index);
      }
    });
  }

  public hit(column: number, timeElapsed?: number, isAfterSeek?: boolean) {
    if (this.pressedColumns[column]) {
      return;
    }

    this.tappedColumns[column] = true;
    this.pressedColumns[column] = true;

    if (!this.game.replayPlayer && this.game.state !== "PLAY") {
      return;
    }

    if (!timeElapsed) {
      this.game.timeElapsed = Math.round(this.game.song.seek() * 1000);
    }

    this.checkLateMisses(timeElapsed ?? this.game.timeElapsed);

    if (this.game.state === "PLAY" && !isAfterSeek) {
      this.game.audioSystem.playNextHitsounds(column);
    }

    this.game.replayRecorder?.record(column, true);
    this.game.columns[column][this.game.currentColumnIndices[column]]?.hit(
      timeElapsed,
    );
  }

  public release(column: number, timeElapsed?: number) {
    if (!this.pressedColumns[column]) {
      return;
    }

    this.pressedColumns[column] = false;
    this.releasedColumns[column] = true;

    if (!this.game.replayPlayer && this.game.state !== "PLAY") {
      return;
    }

    if (!timeElapsed) {
      this.game.timeElapsed = Math.round(this.game.song.seek() * 1000);
    }

    this.checkLateMisses(timeElapsed ?? this.game.timeElapsed);

    this.game.replayRecorder?.record(column, false);
    this.game.columns[column][this.game.currentColumnIndices[column]]?.release(
      timeElapsed,
    );
  }

  public checkLateMisses(timeElapsed: number): void {
    const lateHitObjects: (Tap | Hold)[] = [];

    const getLateMissTime = (hitObject: Tap | Hold) => {
      if (hitObject.data.type === "tap") {
        return hitObject.data.time + this.game.hitWindows[0];
      } else {
        return hitObject.data.endTime + this.game.hitWindows[0] * 1.5;
      }
    };

    for (let columnId = 0; columnId < this.game.columns.length; columnId++) {
      for (
        let i = this.game.currentColumnIndices[columnId];
        i < this.game.columns[columnId].length;
        i++
      ) {
        const hitObject = this.game.columns[columnId][i];
        const missTime = getLateMissTime(hitObject);

        if (timeElapsed > missTime) {
          lateHitObjects.push(hitObject);
        } else {
          break;
        }
      }
    }

    if (lateHitObjects.length > 0) {
      lateHitObjects
        .sort((a, b) => getLateMissTime(a) - getLateMissTime(b))
        .forEach((hitObject) => hitObject.update(timeElapsed));
    }
  }

  public updateGamepadInputs() {
    const gamepad =
      Array.from(navigator.getGamepads()).find((gp) => gp !== null) || null;
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
        this.columnPressedKeybinds[column].add(`🎮Btn${i}`);
        if (this.columnPressedKeybinds[column].size === 1) {
          this.hit(column);
        }
      } else if (!button.pressed && this.gamepadState[i]) {
        this.columnPressedKeybinds[column].delete(`🎮Btn${i}`);
        if (this.columnPressedKeybinds[column].size === 0) {
          this.release(column);
        }
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

    if (this.game.replayPlayer && event.code === "Space") {
      if (this.game.song.playing()) {
        this.game.song.pause();
      } else {
        this.game.song.play();
      }

      return;
    }

    const column = this.keybindsMap.get(event.code);
    if (column === undefined) {
      return;
    }

    const shouldSkipIntro =
      this.game.state === "PLAY" &&
      this.game.timeElapsed < this.game.startTime - 2000;
    if (shouldSkipIntro) {
      // 1 second before first hit object
      const time = this.game.startTime / 1000 - 1;

      if (this.game.videoEl) {
        this.game.videoEl.currentTime = time;
      }
      this.game.song.seek(this.game.startTime / 1000 - 1);
      return;
    }
    console.log("test");

    if (this.game.replayPlayer) {
      return;
    }

    this.columnPressedKeybinds[column].add(event.code);

    if (this.columnPressedKeybinds[column].size === 1) {
      this.hit(column);
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (this.game.replayPlayer) {
      return;
    }

    const column = this.keybindsMap.get(event.code);
    if (column === undefined) {
      return;
    }

    this.columnPressedKeybinds[column].delete(event.code);
    if (this.columnPressedKeybinds[column].size === 0) {
      this.release(column);
    }
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
