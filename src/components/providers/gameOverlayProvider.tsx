"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode, createContext, useState } from "react";
import GameModal from "../game/gameModal";

export interface OpenGameOverlayData {
  isOpen: true;
  beatmapSetId: number;
  beatmapId: number;
}

interface ClosedGameOverlayData {
  isOpen: false;
  beatmapSetId: null;
  beatmapId: null;
}

const defaultData: ClosedGameOverlayData = {
  isOpen: false,
  beatmapSetId: null,
  beatmapId: null,
};

export const GameOverlayContext = createContext<{
  data: OpenGameOverlayData | ClosedGameOverlayData;
  closeGame: () => void;
  startGame: (beatmapSetId: number, beatmapId: number) => void;
}>({
  data: defaultData,
  closeGame: () => null,
  startGame: () => null,
});

export const GameOverlayProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OpenGameOverlayData | ClosedGameOverlayData>(
    defaultData,
  );

  const closeGame = () => {
    setData(defaultData);
  };

  const startGame = (beatmapSetId: number, beatmapId: number) => {
    setData({
      isOpen: true,
      beatmapSetId,
      beatmapId,
    });
  };

  return (
    <GameOverlayContext.Provider value={{ data, startGame, closeGame }}>
      {/* Game overlay */}
      <Dialog open={data.isOpen}>
        <DialogContent
          className="h-full w-full max-w-full border-none p-0 focus:outline-none"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Game Window</DialogTitle>
          <GameModal />
        </DialogContent>
      </Dialog>

      {children}
    </GameOverlayContext.Provider>
  );
};
