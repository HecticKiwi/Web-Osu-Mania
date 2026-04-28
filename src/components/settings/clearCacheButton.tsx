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
import { useBeatmapSetCacheStore } from "@/stores/beatmapSetCacheStore";
import { useStoredBeatmapSetsStore } from "@/stores/storedBeatmapSetsStore";
import { filesize } from "filesize";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const ClearCacheButton = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const idbUsage = useBeatmapSetCacheStore.use.idbUsage();
  const clearIdbCache = useBeatmapSetCacheStore.use.clearIdbCache();
  const storedBeatmapSets = useStoredBeatmapSetsStore.use.storedBeatmapSets();
  const resetStoredBeatmapSets =
    useStoredBeatmapSetsStore.use.resetStoredBeatmapSets();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className={cn(className)}
          disabled={!idbUsage}
        >
          Clear Cache ({storedBeatmapSets.length} stored, {filesize(idbUsage)})
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to clear the IndexedDB Cache?
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
              clearIdbCache();
              resetStoredBeatmapSets();
              toast("Cache has been cleared.");
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

export default ClearCacheButton;
