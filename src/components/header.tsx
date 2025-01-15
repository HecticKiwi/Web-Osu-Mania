import ManiaIcon from "@/components/maniaIcon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { SiKofi } from "react-icons/si";
import MobileSidebar from "./mobileSidebar";
import NavLink from "./navLink";

const Header = () => {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background sm:py-6">
        <div className="flex items-center">
          <div className="hidden h-[1px] grow bg-gradient-to-r from-transparent to-primary sm:block"></div>

          <nav className="flex grow items-center gap-4 p-2 sm:grow-0 sm:gap-8 sm:rounded-xl sm:border sm:px-6">
            <Link href={"/"} prefetch={false}>
              <div className="flex items-center gap-2">
                <ManiaIcon difficultyRating={6} className="shrink-0" />
                <span className="hidden text-xl font-semibold min-[470px]:flex">
                  Web osu!mania
                </span>
              </div>
            </Link>

            <div className=" flex items-center gap-4">
              <NavLink href="/">Play</NavLink>
              <NavLink href="/faq">FAQ</NavLink>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Link
                        prefetch={false}
                        href="https://github.com/HecticKiwi/Web-Osu-Mania"
                        target="_blank"
                      >
                        <FaGithub className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Source Code</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Link
                        prefetch={false}
                        href="https://ko-fi.com/hectickiwi"
                        target="_blank"
                      >
                        <SiKofi className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Donate on Ko-fi</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <MobileSidebar />
            </div>
          </nav>

          <div className="hidden h-[1px] grow bg-gradient-to-l from-transparent to-primary sm:block"></div>
        </div>
      </header>
    </>
  );
};

export default Header;
