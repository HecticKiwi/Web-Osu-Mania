import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { idb } from "@/lib/idb";
import type { HighScore } from "@/stores/highScoresStore";
import { useHighScoresStore } from "@/stores/highScoresStore";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const DeleteHighScoreButton = ({
  highScore,
  position,
  beatmapSetId,
  beatmapId,
}: {
  highScore: HighScore;
  position: number;
  beatmapSetId: number;
  beatmapId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const setHighScores = useHighScoresStore.use.setHighScores();

  const deleteHighScore = async () => {
    setHighScores((draft) => {
      draft[beatmapSetId][beatmapId].splice(position - 1, 1);
    });

    if (highScore.replayId) {
      await idb.deleteReplay(highScore.replayId);
    }

    setIsOpen(false);
    toast("High score deleted successfully.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon" className="h-6 w-8">
                <Trash2 className="size-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>

          <TooltipContent>
            <p>Delete High Score</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this high score?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant={"destructive"}
            onClick={() => deleteHighScore()}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteHighScoreButton;
