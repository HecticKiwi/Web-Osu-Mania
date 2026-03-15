import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BeatmapSet } from "@/lib/osuApi";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { Button } from "../ui/button";
import CollectionsDropdownContent from "./collectionsDropdownContent";

const CollectionsDropdown = ({ beatmapSet }: { beatmapSet: BeatmapSet }) => {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className={cn("size-8")} asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="h-8 w-8 opacity-0 transition group-hover:opacity-100 focus:opacity-100"
              >
                <Bookmark className="size-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Collections</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="w-72">
        <CollectionsDropdownContent beatmapSet={beatmapSet} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollectionsDropdown;
