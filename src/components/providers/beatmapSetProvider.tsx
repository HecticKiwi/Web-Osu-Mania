"use client";

import { BeatmapSet } from "@/lib/osuApi";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export const BeatmapSetContext = createContext<{
  beatmapSet: BeatmapSet | null;
  setBeatmapSet: Dispatch<SetStateAction<BeatmapSet | null>>;
}>({
  beatmapSet: null,
  setBeatmapSet: () => {},
});

const BeatmapSetProvider = ({ children }: { children: ReactNode }) => {
  const [beatmapSet, setBeatmapSet] = useState<BeatmapSet | null>(null);

  return (
    <>
      <BeatmapSetContext.Provider value={{ beatmapSet, setBeatmapSet }}>
        {children}
      </BeatmapSetContext.Provider>
    </>
  );
};

export default BeatmapSetProvider;
