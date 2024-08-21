import {
  defaultSettings,
  Settings,
} from "@/components/providers/settingsProvider";
import { OSU_HEIGHT, OSU_WIDTH } from "@/osuMania/constants";
import { type ClassValue, clsx } from "clsx";
import { Container } from "pixi.js";
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

// I have no idea what file format the skin.ini file uses,
// but this converts it to a .ini for use with the ini NPM package
export function processIniString(iniStr: string) {
  const lines = iniStr
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("//"))
    .map((line) => line.trim().replace(":", "="));

  let sectionIndex = lines.indexOf("[Mania]");

  while (sectionIndex !== -1) {
    const slicedLines = lines.slice(sectionIndex);

    const keys = slicedLines
      .find((line) => line.startsWith("Keys"))
      ?.split(" ")[1];

    if (!keys) {
      throw new Error("Failed to parse skin.ini: [Mania] section missing Keys");
    }

    lines[sectionIndex] = `[Mania${keys}]`;

    sectionIndex = lines.indexOf("[Mania]", sectionIndex + 1);
  }

  return lines.join("\r\n");
}

export function scaleEntityWidth(sprite: Container, width: number) {
  const oldWidth = sprite.width;
  sprite.width = width;
  sprite.height = (width * sprite.height) / oldWidth;
}
export function scaleWidth(width: number, windowWidth: number) {
  return (width / OSU_WIDTH) * 2038;
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

  const settings: Settings = JSON.parse(localSettings);

  return settings;
}
