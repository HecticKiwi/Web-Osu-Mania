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

export type Settings = {
  version: number;
  volume: number;
  musicVolume: number;
  sfxVolume: number;
  scrollSpeed: number;
  backgroundDim: number;
  show300g: boolean;
  showErrorBar: boolean;
  audioOffset: number;
  showFpsCounter: boolean;
  storeDownloadedBeatmaps: boolean;
  upscroll: boolean;
  beatmapProvider: BeatmapProvider;
  customBeatmapProvider: string;
  keybinds: {
    keyModes: string[][];
  };
  mods: {
    autoplay: boolean;
    easy: boolean;
    playbackRate: number;
    hardRock: boolean;
    mirror: boolean;
    random: boolean;
  };
};

export const defaultSettings: Settings = {
  version: 1,
  volume: 1,
  musicVolume: 1,
  sfxVolume: 0.4,
  scrollSpeed: 20,
  backgroundDim: 0.75,
  show300g: true,
  showErrorBar: true,
  audioOffset: 0,
  showFpsCounter: false,
  storeDownloadedBeatmaps: false,
  upscroll: false,
  beatmapProvider: "NeriNyan",
  customBeatmapProvider: "",
  keybinds: {
    keyModes: [
      ["Space"],
      ["KeyF", "KeyJ"],
      ["KeyF", "Space", "KeyJ"],
      ["KeyD", "KeyF", "KeyJ", "KeyK"],
      ["KeyD", "KeyF", "Space", "KeyJ", "KeyK"],
      ["KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL"],
      ["KeyS", "KeyD", "KeyF", "Space", "KeyJ", "KeyK", "KeyL"],
      ["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon"],
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
      ],
    ],
  },
  mods: {
    autoplay: false,
    easy: false,
    playbackRate: 1,
    hardRock: false,
    mirror: false,
    random: false,
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
