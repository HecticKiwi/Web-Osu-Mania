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
import { useCollectionsStore } from "@/stores/collectionsStore";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const DeleteCollectionButton = () => {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const setCollections = useCollectionsStore((state) => state.setCollections);
  const [isOpen, setIsOpen] = useState(false);
  const collection = search.collection;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <DialogTrigger disabled={!collection} asChild>
            <TooltipTrigger asChild>
              <Button
                variant={"destructive"}
                size="icon"
                className="shrink-0"
                disabled={!collection}
              >
                <Trash2 className="size-5" />
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p>Delete Collection</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete the {collection} collection?
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
              if (!collection) {
                return;
              }

              setCollections((draft) => {
                delete draft[collection];
              });

              toast("Collection deleted successfully.");

              setIsOpen(false);
              navigate({ to: "/" });
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCollectionButton;
