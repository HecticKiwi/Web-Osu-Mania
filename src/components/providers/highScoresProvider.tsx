"use client";

import { Results } from "@/types";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { Updater, useImmer } from "use-immer";

export type HighScore = {
  timestamp: number;
  mods: string[];
  results: Results;
};

export type BeatmapSetHighScores = Record<number, HighScore>;

const HighScoresContext = createContext<{
  highScores: Record<number, BeatmapSetHighScores>;
  setHighScores: Updater<Record<number, BeatmapSetHighScores>>;
} | null>(null);

export const useHighScoresContext = () => {
  const highScores = useContext(HighScoresContext);

  if (!highScores) {
    throw new Error("Using high scores context outside of provider");
  }

  return highScores;
};

const HighScoresProvider = ({ children }: { children: ReactNode }) => {
  const [highScores, setHighScores] = useImmer<
    Record<number, BeatmapSetHighScores>
  >(null!);

  // Load high scores from localstorage
  useEffect(() => {
    const localHighScores = localStorage.getItem("highScores");

    if (localHighScores) {
      setHighScores(JSON.parse(localHighScores));
    } else {
      setHighScores({});
    }
  }, [setHighScores]);

  // Update localStorage whenever high scores change
  useEffect(() => {
    if (highScores) {
      localStorage.setItem("highScores", JSON.stringify(highScores));
    }
  }, [highScores]);

  if (!highScores) {
    return null;
  }

  return (
    <>
      <HighScoresContext.Provider
        value={{
          highScores,
          setHighScores,
        }}
      >
        {children}
      </HighScoresContext.Provider>
    </>
  );
};

export default HighScoresProvider;
