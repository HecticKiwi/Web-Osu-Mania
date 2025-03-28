"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getBeatmapSetIdFromOsz } from "@/lib/beatmapParser";
import { BeatmapSet } from "@/lib/osuApi";
import { BASE_PATH } from "@/lib/utils";
import { Howler } from "howler";
import queryString from "query-string";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import GameModal from "../game/gameModal";
import UploadDialog from "./uploadDialog";

export type GameData = number | null;

const GameContext = createContext<{
  closeGame: () => void;
  startGame: (beatmapId: number) => void;
  uploadedBeatmapSet: File | null;
  setUploadedBeatmapSet: Dispatch<SetStateAction<File | null>>;
  beatmapSet: BeatmapSet | null;
  setBeatmapSet: Dispatch<SetStateAction<BeatmapSet | null>>;
  beatmapId: GameData | null;
} | null>(null);

export const useGameContext = () => {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error("Using game context outside of provider");
  }

  return game;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedBeatmapSetFile, setUploadedBeatmapSetFile] =
    useState<File | null>(null);
  const [beatmapSet, setBeatmapSet] = useState<BeatmapSet | null>(null);
  const [beatmapId, setBeatmapId] = useState<GameData | null>(null);

  const closeGame = useCallback(() => {
    Howler.unload();
    setBeatmapId(null);

    // If playing from an uploaded file file, leave beatmapSet so the upload dialog stays open
    if (!uploadedBeatmapSetFile) {
      setBeatmapSet(null);
    }
  }, [uploadedBeatmapSetFile]);

  const startGame = useCallback((beatmapId: number) => {
    setBeatmapId(beatmapId);
  }, []);

  useEffect(() => {
    const updateBeatmapSetFromUpload = async () => {
      if (uploadedBeatmapSetFile) {
        const beatmapSetId = await getBeatmapSetIdFromOsz(
          uploadedBeatmapSetFile,
        );

        // Fetch beatmap set data from osu (cover BG, preview audio, diff star ratings, etc.)
        // Theoretically I could do this manually but that's too much work :<
        const url = queryString.stringifyUrl({
          url: `${BASE_PATH}/api/getBeatmap`,
          query: {
            beatmapSetId,
          },
        });

        const beatmapSet: BeatmapSet = await fetch(url).then((res) =>
          res.json(),
        );

        setBeatmapSet(beatmapSet);
      } else {
        setBeatmapSet(null);
      }
    };

    updateBeatmapSetFromUpload();
  }, [uploadedBeatmapSetFile]);

  return (
    <GameContext.Provider
      value={{
        uploadedBeatmapSet: uploadedBeatmapSetFile,
        setUploadedBeatmapSet: setUploadedBeatmapSetFile,
        beatmapSet,
        setBeatmapSet,
        startGame,
        closeGame,
        beatmapId,
      }}
    >
      {/* .osz upload dialog */}
      <UploadDialog />

      {/* Game overlay */}
      <Dialog open={!!beatmapId}>
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
