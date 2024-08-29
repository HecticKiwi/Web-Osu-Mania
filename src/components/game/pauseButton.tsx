import { Game } from "@/osuMania/game";
import { Button } from "../ui/button";
import { Pause } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const PauseButton = ({
  setIsPaused,
}: {
  setIsPaused: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Button
        className="fixed left-[30px] top-[30px]"
        variant={"secondary"}
        size={"icon"}
        onClick={() => setIsPaused(true)}
        tabIndex={-1}
      >
        <Pause />
      </Button>
    </>
  );
};

export default PauseButton;
