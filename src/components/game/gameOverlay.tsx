import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGameStore } from "../../stores/gameStore";
import GameModal from "./gameModal";

export const GameOverlay = () => {
  const beatmapId = useGameStore.use.beatmapId();

  return (
    <Dialog open={!!beatmapId}>
      <DialogContent
        className="h-full w-full max-w-full border-none p-0 focus:outline-hidden"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Game Window</DialogTitle>
        <GameModal />
      </DialogContent>
    </Dialog>
  );
};
