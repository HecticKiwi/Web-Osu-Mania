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
import { useSettingsStore } from "@/stores/settingsStore";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const ResetSettingsButton = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const resetSettings = useSettingsStore.use.resetSettings();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className={cn(className)}>
          Reset Settings
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to reset the settings?
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
            onClick={() => {
              resetSettings();
              toast("Settings have been reset.");
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

export default ResetSettingsButton;
