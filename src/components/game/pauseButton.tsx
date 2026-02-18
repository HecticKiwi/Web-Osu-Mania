import { Pause } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

const PauseButton = ({
  setIsPaused,
}: {
  setIsPaused: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Button
        className="fixed top-[30px] left-[30px]"
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
