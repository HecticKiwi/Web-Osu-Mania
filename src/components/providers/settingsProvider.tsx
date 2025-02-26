"use client";

import { getSettings } from "@/lib/utils";
import { Howler } from "howler";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { Updater, useImmer } from "use-immer";

export const BEATMAP_API_PROVIDERS = {
  NeriNyan: "https://api.nerinyan.moe/d/$setId",
  SayoBot: "https://dl.sayobot.cn/beatmaps/download/$setId",
  "Mino (catboy.best)": "https://catboy.best/d/$setIdn",
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
  keybinds: {
    keyModes: (string | null)[][];
    pause: string | null;
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
    canfail: boolean;
    fc: boolean;
  };
  ui: { // There is a lot of settings I would move here but that would be a major change.
    hideScore: boolean;
    hideCombo: boolean;
    hideAccuracy: boolean;
    hideJudgement: boolean;
    hideProgressBar: boolean;
    hideHealthBar: boolean;
  };
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
  keybinds: {
    keyModes: [
      [ "Space" ],
      [ "KeyF", "KeyJ" ],
      [ "KeyF", "Space", "KeyJ" ],
      [ "KeyD", "KeyF", "KeyJ", "KeyK" ],
      [ "KeyD", "KeyF", "Space", "KeyJ", "KeyK" ],
      [ "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL" ],
      [ "KeyS", "KeyD", "KeyF", "Space", "KeyJ", "KeyK", "KeyL" ],
      [ "KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon" ],
      [ "KeyA", "KeyS", "KeyD", "KeyF", "Space", "KeyJ", "KeyK", "KeyL", "Semicolon" ],
      [ "KeyA", "KeyS", "KeyD", "KeyF", "KeyV", "KeyN", "KeyJ", "KeyK", "KeyL", "Semicolon" ],
    ],
    pause: null,
  },
  mods: {
    autoplay: false,
    easy: false,
    playbackRate: 1,
    hardRock: false,
    mirror: false,
    random: false,
    constantSpeed: false,
    holdOff: false,
    canfail: false,
    fc: false,
  },
  ui: {
    hideScore: false,
    hideCombo: false,
    hideAccuracy: false,
    hideJudgement: false,
    hideProgressBar: false,
    hideHealthBar: false,
  },
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
