import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { FaDiscord, FaGithub } from "react-icons/fa";

const SocialButtons = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <a
                href="https://github.com/HecticKiwi/Web-Osu-Mania"
                target="_blank"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Source Code</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <a href="https://discord.gg/8zfxCdkfTx" target="_blank">
                <FaDiscord className="h-5 w-5" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Discord Server</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <a href="https://github.com/sponsors/HecticKiwi" target="_blank">
                <Heart className="h-5 w-5" fill="white" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sponsor Project</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SocialButtons;
