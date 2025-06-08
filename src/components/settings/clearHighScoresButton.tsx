"use client";

import { idb } from "@/lib/idb";
import { toast } from "sonner";
import { useHighScoresStore } from "../../stores/highScoresStore";
import { Button } from "../ui/button";

const ClearHighScoresButton = () => {
  const resetHighScores = useHighScoresStore.use.resetHighScores();

  return (
    <Button
      className="w-full"
      variant={"destructive"}
      size={"sm"}
      onClick={async () => {
        await idb.clearReplays();
        resetHighScores();

        toast("High scores have been reset.");
      }}
    >
      Clear High Scores
    </Button>
  );
};

export default ClearHighScoresButton;
