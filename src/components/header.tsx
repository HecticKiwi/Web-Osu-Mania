import { useIsOnline } from "@/hooks/useIsOnline";
import { Link } from "@tanstack/react-router";
import { GlobeOff } from "lucide-react";
import ManiaIcon from "./maniaIcon";
import MobileSidebar from "./mobileSidebar";
import NavLink from "./navLink";
import SocialButtons from "./socialButtons";

const Header = () => {
  const isOnline = useIsOnline();

  return (
    <header className="bg-card/80 outline-border sticky top-0 z-20 outline backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-475 items-center justify-between px-2 sm:px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to={"/"}>
            <div className="flex items-center gap-2">
              <ManiaIcon difficultyRating={6} className="shrink-0" />
              <span className="hidden text-xl font-semibold min-[470px]:flex">
                Web osu!mania
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <NavLink to="/" viewTransition={{ types: ["fade"] }}>
              Play
            </NavLink>
            <NavLink to="/faq" viewTransition={{ types: ["fade"] }}>
              FAQ
            </NavLink>
            <NavLink to="/updates" viewTransition={{ types: ["fade"] }}>
              Updates
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isOnline && (
            <div title="You're offline.">
              <GlobeOff className="text-muted-foreground size-4" />
            </div>
          )}

          <SocialButtons className="hidden lg:block" />

          <MobileSidebar />
        </div>
      </div>
    </header>
  );
};

export default Header;
