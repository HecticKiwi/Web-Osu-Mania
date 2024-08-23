"use client";

import { Howl } from "howler";
import { ReactNode, createContext, useContext, useState } from "react";
import { settingsContext } from "./settingsProvider";

export const AudioContext = createContext<{
  play: (beatmapSetId: string) => void;
  stop: () => void;
}>({
  play: () => {},
  stop: () => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [audio, setAudio] = useState<Howl | null>(null);
  const { settings, resetSettings, updateSettings } =
    useContext(settingsContext);

  const play = (beatmapSetId: string) => {
    stop();

    const newAudio = new Howl({
      src: [`https://b.ppy.sh/preview/${beatmapSetId}.mp3`],
      format: "mp3",
      html5: true,
      autoplay: true,
      volume: 0,
      onplay: () => {
        newAudio.fade(0, settings.musicVolume, 500);
      },
    });

    setAudio(newAudio);
  };

  const stop = () => {
    if (audio) {
      audio.fade(audio.volume(), 0, 500);
      setAudio(null);

      setTimeout(() => {
        audio.unload();
      }, 500);
    }
  };

  return (
    <AudioContext.Provider value={{ play, stop }}>
      {children}
    </AudioContext.Provider>
  );
};
