import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { defaultSettings, useSettingsStore } from "@/stores/settingsStore";
import { useState } from "react";
import { toast } from "sonner";

const ResetColorsButton = ({
  keyCount,
  className,
}: {
  keyCount: number;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const setSettings = useSettingsStore.use.setSettings();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className={cn(className)}>
          Reset Colors
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to reset the colors?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant={"destructive"}
            onClick={() => {
              setSettings((draft) => {
                draft.skin.colors.custom[keyCount] =
                  defaultSettings.skin.colors.custom[keyCount];
              });

              toast("Colors have been reset.");
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

export default ResetColorsButton;
