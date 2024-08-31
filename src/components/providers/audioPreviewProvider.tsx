"use client";

import { Howl } from "howler";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useSettingsContext } from "./settingsProvider";

const AudioContext = createContext<{
  playAudio: (beatmapSetId: number) => void;
  stopAudio: () => void;
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

  const stopAudio = useCallback(() => {
    if (audio) {
      audio.fade(audio.volume(), 0, 500);
      setAudio(null);

      setTimeout(() => {
        audio.unload();
      }, 500);
    }
  }, [audio]);

  const playAudio = useCallback(
    (beatmapSetId: number) => {
      stopAudio();

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
    },
    [settings?.musicVolume, stopAudio],
  );

  return (
    <AudioContext.Provider value={{ playAudio, stopAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
