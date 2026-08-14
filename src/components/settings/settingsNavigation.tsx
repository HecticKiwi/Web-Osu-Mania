import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableOfContents } from "lucide-react";
import { settingsContainerId } from "./settingsTab";

const SettingsNavigation = ({ sectionTitles }: { sectionTitles: string[] }) => {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant={"secondary"}>
                <TableOfContents />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Jump to Section</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Sections</DropdownMenuLabel>
        {sectionTitles.map((sectionTitle) => (
          <DropdownMenuItem
            key={sectionTitle}
            className="cursor-pointer"
            onClick={() => {
              const sectionTitleEl = document.getElementById(sectionTitle);
              const settingsContainerEl =
                document.getElementById(settingsContainerId);

              if (sectionTitleEl && settingsContainerEl) {
                settingsContainerEl.scrollTo({
                  top: sectionTitleEl.offsetTop,
                  behavior: "smooth",
                });
              }
            }}
          >
            {sectionTitle}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsNavigation;
