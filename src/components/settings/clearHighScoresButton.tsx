"use client";

import { idb } from "@/lib/idb";
import { toast } from "sonner";
import { useHighScoresStore } from "../../stores/highScoresStore";
import { Button } from "../ui/button";

const ClearHighScoresButton = () => {
  const setHighScores = useHighScoresStore.use.setHighScores();

  return (
    <Button
      className="mt-4 w-full"
      variant={"destructive"}
      size={"sm"}
      onClick={async () => {
        await idb.clearReplays();
        setHighScores(() => ({}));

        toast("High scores have been reset.");
      }}
    >
      Clear High Scores
    </Button>
  );
};

export default ClearHighScoresButton;
