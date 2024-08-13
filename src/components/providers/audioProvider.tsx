"use client";

import { Howl } from "howler";
import { ReactNode, createContext, useContext, useState } from "react";

type Url = string | null;

export const AudioContext = createContext<{
  currentSong: Url;
  isPlaying: boolean;
  play: (beatmapSetId: string) => void;
  stop: () => void;
}>({
  currentSong: null,
  isPlaying: false,
  play: () => {},
  stop: () => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Url>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<Howl | null>(null);

  const play = (beatmapSetId: string) => {
    stop();

    const newAudio = new Howl({
      src: [`https://b.ppy.sh/preview/${beatmapSetId}.mp3`],
      format: "mp3",
      html5: true,
      preload: true,
      autoplay: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
      volume: 0,
    });

    newAudio.fade(0, 1, 500);

    setAudio(newAudio);
    setCurrentSong(beatmapSetId);
  };

  const stop = () => {
    if (audio) {
      audio.fade(1, 0, 500);

      setTimeout(() => {
        audio.unload();
      }, 500);
    }
  };

  return (
    <AudioContext.Provider value={{ currentSong, isPlaying, play, stop }}>
      {children}
    </AudioContext.Provider>
  );
};
