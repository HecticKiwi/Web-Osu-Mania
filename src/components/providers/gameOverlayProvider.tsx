"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode, createContext, useContext, useState } from "react";
import GameModal from "../game/gameModal";

export type GameData = {
  beatmapSetId: number;
  beatmapId: number;
};

const GameContext = createContext<{
  data: GameData | null;
  closeGame: () => void;
  startGame: (beatmapSetId: number, beatmapId: number) => void;
} | null>(null);

export const useGameContext = () => {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error("Using game context outside of provider");
  }

  return game;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GameData | null>(null);

  const closeGame = () => {
    setData(null);
  };

  const startGame = (beatmapSetId: number, beatmapId: number) => {
    setData({
      beatmapSetId,
      beatmapId,
    });
  };

  return (
    <GameContext.Provider value={{ data, startGame, closeGame }}>
      {/* Game overlay */}
      <Dialog open={!!data}>
        <DialogContent
          className="h-full w-full max-w-full border-none p-0 focus:outline-none"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Game Window</DialogTitle>
          <GameModal />
        </DialogContent>
      </Dialog>

      {children}
    </GameContext.Provider>
  );
};
