"use client";

import { getSettings } from "@/lib/utils";
import { Howler } from "howler";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { Updater, useImmer } from "use-immer";

export const BEATMAP_API_PROVIDERS = {
  NeriNyan: "https://api.nerinyan.moe/d/$setId",
  "Mino (catboy.best)": "https://catboy.best/d/$setIdn",
  SayoBot: "https://dl.sayobot.cn/beatmaps/download/$setId",
} as const;

export type BeatmapProvider = keyof typeof BEATMAP_API_PROVIDERS | "Custom";

export const SKIN_STYLES = ["bars", "circles", "arrows", "diamonds"] as const;
export type SkinStyle = (typeof SKIN_STYLES)[number];

export const SKIN_STYLE_ICONS: Record<SkinStyle, string> = {
  bars: "▬",
  circles: "⬤",
  arrows: "↗",
  diamonds: "◆",
};

export type Settings = {
  version: number;
  volume: number;
  musicVolume: number;
  sfxVolume: number;
  scrollSpeed: number;
  backgroundDim: number;
  backgroundBlur: number;
  show300g: boolean;
  showErrorBar: boolean;
  audioOffset: number;
  showFpsCounter: boolean;
  storeDownloadedBeatmaps: boolean;
  upscroll: boolean;
  darkerHoldNotes: boolean;
  hitPositionOffset: number;
  beatmapProvider: BeatmapProvider;
  customBeatmapProvider: string;
  proxyBeatmapDownloads: boolean;
  ignoreBeatmapHitsounds: boolean;
  style: SkinStyle;
  errorBarScale: number;
  preferMetadataInOriginalLanguage: boolean;
  unpauseDelay: number;
  retryOnFail: boolean;
  showUnrankedModes: boolean;
  keybinds: {
    keyModes: (string | null)[][];
    pause: string | null;
    retry: string | null;
  };
  mods: {
    autoplay: boolean;
    easy: boolean;
    playbackRate: number;
    hardRock: boolean;
    mirror: boolean;
    random: boolean;
    constantSpeed: boolean;
    holdOff: boolean;
    noFail: boolean;
    suddenDeath: boolean;
  };
  ui: {
    showScore: boolean;
    showCombo: boolean;
    showAccuracy: boolean;
    showJudgement: boolean;
    showProgressBar: boolean;
    showHealthBar: boolean;
  };
  replays: boolean;
};

export const defaultSettings: Settings = {
  version: 1,
  volume: 1,
  musicVolume: 1,
  sfxVolume: 0.4,
  scrollSpeed: 20,
  backgroundDim: 0.75,
  backgroundBlur: 0,
  show300g: true,
  showErrorBar: true,
  audioOffset: 0,
  showFpsCounter: false,
  storeDownloadedBeatmaps: false,
  upscroll: false,
  darkerHoldNotes: true,
  hitPositionOffset: 130,
  beatmapProvider: "NeriNyan",
  customBeatmapProvider: "",
  proxyBeatmapDownloads: false,
  ignoreBeatmapHitsounds: false,
  style: "bars",
  errorBarScale: 1,
  preferMetadataInOriginalLanguage: false,
  unpauseDelay: 1500,
  retryOnFail: false,
  showUnrankedModes: false,
  keybinds: {
    keyModes: [
      ["Space"], // 1K
      ["KeyF", "KeyJ"], // 2K
      ["KeyF", "Space", "KeyJ"], // 3K
      ["KeyD", "KeyF", "KeyJ", "KeyK"], // 4K
      ["KeyD", "KeyF", "Space", "KeyJ", "KeyK"], // 5K
      ["KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL"], // 6K
      ["KeyS", "KeyD", "KeyF", "Space", "KeyJ", "KeyK", "KeyL"], // 7K
      ["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon"], // 8K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "Space",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 9K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyV",
        "KeyN",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 10K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyV",
        "Space",
        "KeyN",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 11K (No maps)
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyC",
        "KeyV",
        "KeyN",
        "KeyM",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 12K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyC",
        "KeyV",
        "Space",
        "KeyN",
        "KeyM",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 13K (No maps)
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyN",
        "KeyM",
        "Comma",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 14K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyX",
        "KeyC",
        "KeyV",
        "Space",
        "KeyN",
        "KeyM",
        "Comma",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 15K (No Maps)
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyN",
        "KeyM",
        "Comma",
        "Period",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 16K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyV",
        "Space",
        "KeyN",
        "KeyM",
        "Comma",
        "Period",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 17K (No Maps)
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyG",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyN",
        "KeyM",
        "Comma",
        "Period",
        "KeyH",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 18K
    ],
    pause: null,
    retry: "Backquote",
  },
  mods: {
    easy: false,
    noFail: false,
    hardRock: false,
    suddenDeath: false,
    autoplay: false,
    random: false,
    mirror: false,
    constantSpeed: false,
    holdOff: false,
    playbackRate: 1,
  },
  ui: {
    showScore: true,
    showCombo: true,
    showAccuracy: true,
    showJudgement: true,
    showProgressBar: true,
    showHealthBar: true,
  },
  replays: true,
};

const SettingsContext = createContext<{
  settings: Settings;
  setSettings: Updater<Settings>;
  resetSettings: () => void;
  resetMods: () => void;
} | null>(null);

export const useSettingsContext = () => {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error("Using settings context outside of provider");
  }

  return settings;
};

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useImmer<Settings>(null!);

  // Load settings from localstorage
  useEffect(() => {
    setSettings(getSettings());
  }, [setSettings]);

  // Update localStorage whenever settings change
  useEffect(() => {
    if (settings) {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }, [settings]);

  // Update Howler volume from settings
  useEffect(() => {
    if (settings) {
      Howler.volume(settings.volume);
    }
  }, [settings]);

  const resetSettings = () => {
    setSettings((draft) => ({
      ...defaultSettings,
      mods: draft.mods,
      keybinds: draft.keybinds,
    }));
  };

  const resetMods = () => {
    setSettings((draft) => ({
      ...draft,
      mods: defaultSettings.mods,
    }));
  };

  if (!settings) {
    return null;
  }

  return (
    <>
      <SettingsContext.Provider
        value={{ settings, resetSettings, setSettings, resetMods }}
      >
        {children}
      </SettingsContext.Provider>
    </>
  );
};

export default SettingsProvider;
