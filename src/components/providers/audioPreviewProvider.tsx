"use client";

import { Howl } from "howler";
import { ReactNode, createContext, useContext, useState } from "react";
import { useSettingsContext } from "./settingsProvider";

const AudioContext = createContext<{
  play: (beatmapSetId: number) => void;
  stop: () => void;
} | null>(null);

export const useAudioContext = () => {
  const audio = useContext(AudioContext);

  if (!audio) {
    throw new Error("Using audio context outside of provider");
  }

  return audio;
};

export const AudioPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [audio, setAudio] = useState<Howl | null>(null);
  const { settings } = useSettingsContext();

  const play = (beatmapSetId: number) => {
    stop();

    const newAudio = new Howl({
      src: [`https://b.ppy.sh/preview/${beatmapSetId}.mp3`],
      format: "mp3",
      html5: true, // To prevent XHR errors
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
