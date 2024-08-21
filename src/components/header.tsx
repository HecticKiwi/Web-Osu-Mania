"use client";
import ManiaIcon from "@/components/maniaIcon";
import { AudioProvider } from "@/components/providers/audioProvider";
import BeatmapSetProvider from "@/components/providers/beatmapSetProvider";
import { GameOverlayProvider } from "@/components/providers/gameOverlayProvider";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import SettingsProvider from "@/components/providers/settingsProvider";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-10 bg-background py-6">
        <div className="flex items-center gap-5 pl-8">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-primary"></div>

          <Link href={"/"}>
            <div className="flex items-center gap-2">
              <ManiaIcon difficultyRating={4} />
              <span className="text-xl font-semibold">Web Osu! Mania</span>
            </div>
          </Link>

          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Play
          </Link>

          <Link
            href="/about"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/about")
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            About
          </Link>

          {/* <div className="h-[1px] w-[3px] bg-primary"></div> */}
          {/* <span className="mx-3 text-primary">&middot;</span> */}

          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link
              href="https://github.com/HecticKiwi/Web-Osu-Mania"
              target="_blank"
            >
              <FaGithub className="h-5 w-5" />
            </Link>
          </Button>
          <div className="h-[1px] grow bg-gradient-to-l from-transparent to-primary"></div>
        </div>
      </header>
    </>
  );
};

export default Header;
