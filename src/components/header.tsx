"use client";
import ManiaIcon from "@/components/maniaIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-10 bg-background py-6">
        <div className="flex items-center">
          <div className="h-[1px] grow bg-gradient-to-r from-transparent to-primary"></div>

          <nav className="flex items-center gap-8 rounded-xl border px-6 py-2">
            <Link href={"/"} prefetch={false}>
              <div className="flex items-center gap-2">
                <ManiaIcon difficultyRating={4} className="shrink-0" />
                <span className="hidden text-xl font-semibold sm:block">
                  Web osu!mania
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-5">
              <Link
                prefetch={false}
                href="/"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/" ? "text-foreground" : "text-foreground/60",
                )}
              >
                Play
              </Link>

              <Link
                prefetch={false}
                href="/faq"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith("/faq")
                    ? "text-foreground"
                    : "text-foreground/60",
                )}
              >
                FAQ
              </Link>
            </div>

            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link
                prefetch={false}
                href="https://github.com/HecticKiwi/Web-Osu-Mania"
                target="_blank"
              >
                <FaGithub className="h-5 w-5" />
              </Link>
            </Button>
          </nav>

          <div className="h-[1px] grow bg-gradient-to-l from-transparent to-primary"></div>
        </div>
      </header>
    </>
  );
};

export default Header;
