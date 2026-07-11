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
import { useBeatmapSetCacheStore } from "@/stores/beatmapSetCacheStore";
import { useStoredBeatmapSetsStore } from "@/stores/storedBeatmapSetsStore";
import { filesize } from "filesize";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

export const clearCacheLabel = "Clear Cache";

const ClearCacheButton = ({
  className,
  searchQuery,
  children,
}: {
  className?: string;
  searchQuery?: string;
  children?: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const idbUsage = useBeatmapSetCacheStore.use.idbUsage();
  const clearIdbCache = useBeatmapSetCacheStore.use.clearIdbCache();
  const storedBeatmapSets = useStoredBeatmapSetsStore.use.storedBeatmapSets();
  const resetStoredBeatmapSets =
    useStoredBeatmapSetsStore.use.resetStoredBeatmapSets();

  if (
    searchQuery &&
    !clearCacheLabel.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className={cn(className)}
          disabled={!idbUsage}
        >
          {children} ({storedBeatmapSets.length} stored, {filesize(idbUsage)})
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
