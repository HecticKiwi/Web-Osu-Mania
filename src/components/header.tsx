import ManiaIcon from "@/components/maniaIcon";
import Link from "next/link";
import MobileSidebar from "./mobileSidebar";
import NavLink from "./navLink";
import SocialButtons from "./socialButtons";

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
              <SocialButtons className="hidden lg:block" />

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
