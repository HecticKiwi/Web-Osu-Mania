import ManiaIcon from "@/components/maniaIcon";
import { Link } from "@tanstack/react-router";
import MobileSidebar from "./mobileSidebar";
import NavLink from "./navLink";
import SocialButtons from "./socialButtons";

const Header = () => {
  return (
    <>
      <header className="bg-background sticky top-0 z-10 sm:py-6">
        <div className="flex items-center">
          <div className="to-primary hidden h-px grow bg-linear-to-r from-transparent sm:block"></div>

          <nav className="flex grow items-center gap-4 border p-2 sm:grow-0 sm:gap-8 sm:rounded-xl sm:border sm:px-6">
            <Link to={"/"}>
              <div className="flex items-center gap-2">
                <ManiaIcon difficultyRating={6} className="shrink-0" />
                <span className="hidden text-xl font-semibold min-[470px]:flex">
                  Web osu!mania
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <NavLink to="/">Play</NavLink>
              <NavLink to="/faq">FAQ</NavLink>
              <NavLink to="/updates">Updates</NavLink>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <SocialButtons className="hidden lg:block" />

              <MobileSidebar />
            </div>
          </nav>

          <div className="to-primary hidden h-px grow bg-linear-to-l from-transparent sm:block"></div>
        </div>
      </header>
    </>
  );
};

export default Header;
