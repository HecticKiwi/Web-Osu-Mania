"use client";

import { getSettings } from "@/lib/utils";
import { Howler } from "howler";
import { produce } from "immer";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export type Settings = {
  volume: number;
  musicVolume: number;
  sfxVolume: number;
  scrollSpeed: number;
  backgroundDim: number;
  autoplay: boolean;
  playbackRate: number;
  show300g: boolean;
  showErrorBar: boolean;
  audioOffset: number;
  showFpsCounter: boolean;
  keybinds: {
    keyModes: string[][];
    restart: string;
  };
};

export const defaultSettings: Settings = {
  volume: 1,
  musicVolume: 1,
  sfxVolume: 0.4,
  scrollSpeed: 20,
  backgroundDim: 0.75,
  autoplay: false,
  playbackRate: 1,
  show300g: true,
  showErrorBar: true,
  audioOffset: 0,
  showFpsCounter: false,
  keybinds: {
    keyModes: [
      [" "],
      ["f", "j"],
      ["f", " ", "j"],
      ["d", "f", "j", "k"],
      ["d", "f", " ", "j", "k"],
      ["s", "d", "f", "j", "k", "l"],
      ["s", "d", "f", " ", "j", "k", "l"],
      ["a", "s", "d", "f", "j", "k", "l", ";"],
      ["a", "s", "d", "f", " ", "j", "k", "l", ";"],
    ],
    restart: "rshift",
  },
};

export const settingsContext = createContext<{
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  setSettings: Dispatch<SetStateAction<Settings>>;
  resetSettings: () => void;
}>(null!);

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(null!);

  // Load settings from localstorage
  useEffect(() => {
    setSettings(getSettings());
  }, []);

  // Update localStorage whenever settings change
  useEffect(() => {
    if (settings) {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }, [settings]);

  // On volume change
  useEffect(() => {
    if (settings) {
      Howler.volume(settings.volume);
    }
  }, [settings]);

  const resetSettings = () => {
    setSettings({ ...defaultSettings, keybinds: settings.keybinds });
  };

  const updateSettings = (settingsPartial: Partial<Settings>) => {
    setSettings(
      produce((draft) => {
        return {
          ...settings,
          ...settingsPartial,
        };
      }),
    );
  };

  return (
    <>
      <settingsContext.Provider
        value={{ settings, updateSettings, resetSettings, setSettings }}
      >
        {children}
      </settingsContext.Provider>
    </>
  );
};

export default SettingsProvider;
