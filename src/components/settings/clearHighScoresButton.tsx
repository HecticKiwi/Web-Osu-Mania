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
import { idb } from "@/lib/idb";
import { cn } from "@/lib/utils";
import { useHighScoresStore } from "@/stores/highScoresStore";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const ClearHighScoresButton = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const resetHighScores = useHighScoresStore.use.resetHighScores();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className={cn(className)}>
          {children}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to clear the high scores?
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
            onClick={async () => {
              await idb.clearReplays();
              resetHighScores();

              toast("High scores have been cleared.");
              setIsOpen(false);
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearHighScoresButton;
