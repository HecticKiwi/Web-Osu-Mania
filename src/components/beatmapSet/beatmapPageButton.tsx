import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
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
            <Link
              href={`https://osu.ppy.sh/beatmapsets/${beatmapSetId}`}
              target="_blank"
              prefetch={false}
            >
              <ExternalLink className="size-5" />
            </Link>
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
