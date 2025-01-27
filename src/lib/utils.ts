import {
  defaultSettings,
  Settings,
} from "@/components/providers/settingsProvider";
import { OSU_HEIGHT, OSU_WIDTH } from "@/osuMania/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function secondsToMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesStr = String(minutes);
  const secondsStr = String(remainingSeconds).padStart(2, "0");

  return `${minutesStr}:${secondsStr}`;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function roundToPrecision(value: number, precision: number) {
  const magnitude = 10 ** precision;
  return Math.round((value + Number.EPSILON) * magnitude) / magnitude;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function scaleWidth(width: number, windowWidth: number) {
  return (width / OSU_WIDTH) * Math.max(windowWidth, 1528);
}

export function scaleHeight(height: number, windowHeight: number) {
  return (height / OSU_HEIGHT) * windowHeight;
}

function parsePath(path: string): (string | number)[] {
  return path.split(".").flatMap((part) =>
    part
      .split(/[\[\]]/)
      .filter(Boolean)
      .map((key) => (isNaN(Number(key)) ? key : Number(key))),
  );
}

export function getNestedProperty(obj: any, path: string): any {
  const keys = parsePath(path);
  return keys.reduce((acc, key) => acc[key], obj);
}

export function setNestedProperty(obj: any, path: string, value: any): void {
  const keys = parsePath(path);
  keys.reduce((acc, key, index) => {
    if (index === keys.length - 1) {
      acc[key] = value;
    }
    return acc[key];
  }, obj);
}

export function getSettings() {
  const localSettings = localStorage.getItem("settings");
  if (!localSettings) {
    return defaultSettings;
  }

  let settings: Settings = JSON.parse(localSettings);

  // Set defaults for settings and mods that were added in recent updates
  settings = {
    ...defaultSettings,
    ...settings,
  };

  settings.mods = {
    ...defaultSettings.mods,
    ...settings.mods,
  };

  if (!settings.keybinds.keyModes[9]) {
    // Set default 10K keybinds
    settings.keybinds.keyModes[9] = [...defaultSettings.keybinds.keyModes[9]];
  }

  return settings;
}

export function keyCodeToString(code: string) {
  if (code.startsWith("Key")) {
    return code.slice(3); // KeyD => D
  }

  if (code.startsWith("Digit")) {
    return code.slice(5); // Digit6 => 6
  }

  const keyDictionary: { [k: string]: string } = {
    ControlLeft: "LControl",
    ControlRight: "RControl",
    MetaLeft: "LMeta",
    MetaRight: "RMeta",
    AltLeft: "LAlt",
    AltRight: "RAlt",
    BracketLeft: "[",
    BracketRight: "]",
    ShiftLeft: "LShift",
    ShiftRight: "RShift",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",
    Equal: "=",
    Minus: "-",
  };

  const key = keyDictionary[code];

  if (key) {
    return key;
  }

  return code;
}

export function removeFileExtension(filename: string) {
  if (filename) {
    return filename.split(".").shift()!;
  }

  return "";
}

export function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// https://osu.ppy.sh/wiki/en/Beatmap/Difficulty#difficulty-and-star-rating
export function difficultyRatingToRgba(rating: number) {
  return rating < 2
    ? "rgba(102,204,255,0.8)" // Blue
    : rating < 2.7
      ? "rgba(136,179,0,0.8)" // Green
      : rating < 4
        ? "rgba(255,204,34,0.8)" // Yellow
        : rating < 5.3
          ? "rgba(255,78,111,0.8)" // Orange
          : rating < 6.5
            ? "rgba(255,102,170,0.8)" // Magenta
            : "rgba(101,99,212,0.8)"; // Purple
}

export function caseInsensitiveIncludes(a: string, b: string) {
  return a.toLocaleLowerCase().includes(b.toLocaleLowerCase());
}
