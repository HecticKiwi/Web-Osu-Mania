"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { Howler } from "howler";
import { longFormatters } from "date-fns";

export type Settings = {
  volume: number;
  scrollSpeed: number;
  backgroundDim: number;
  autoplay: boolean;
  playbackRate: number;
};

const defaultSettings: Settings = {
  volume: 1,
  scrollSpeed: 20,
  backgroundDim: 0.75,
  autoplay: false,
  playbackRate: 1,
};

export const settingsContext = createContext<{
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}>(null!);

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(null!);

  // Load settings from localstorage
  useEffect(() => {
    const localSettings = localStorage.getItem("settings");
    const settings: Settings = localSettings
      ? JSON.parse(localSettings)
      : defaultSettings;
    setSettings(settings);
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
    setSettings(defaultSettings);
  };

  const updateSettings = (settingsPartial: Partial<Settings>) => {
    setSettings({ ...settings, ...settingsPartial });
  };

  return (
    <>
      <settingsContext.Provider
        value={{ settings, updateSettings, resetSettings }}
      >
        {children}
      </settingsContext.Provider>
    </>
  );
};

export default SettingsProvider;
