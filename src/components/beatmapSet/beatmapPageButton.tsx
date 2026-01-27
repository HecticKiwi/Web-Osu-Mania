import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

const BeatmapSetPageButton = ({ beatmapSetId }: { beatmapSetId: number }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant={"secondary"}
            size={"icon"}
            className="h-8 w-8 bg-secondary/60 focus-within:bg-secondary hover:bg-secondary"
          >
            <a
              href={`https://osu.ppy.sh/beatmapsets/${beatmapSetId}`}
              target="_blank"
            >
              <ExternalLink className="size-5" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go to osu! Beatmap Page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BeatmapSetPageButton;
