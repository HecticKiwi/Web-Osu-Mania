import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarContent from "./sidebar";
import SocialButtons from "./socialButtons";
import { Button } from "./ui/button";
import { DialogDescription, DialogTitle } from "./ui/dialog";

const MobileSidebar = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size={"icon"}
            variant={"outline"}
            className="h-12 w-12 rounded-full lg:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full max-w-[620px] bg-background/50 p-2 sm:max-w-[620px]">
          <DialogTitle className="sr-only">Sidebar</DialogTitle>
          <DialogDescription className="sr-only">
            Edit filters, mods, settings and more.
          </DialogDescription>

          <div className="flex h-full flex-col">
            <SocialButtons />

            <SidebarContent className="mt-2" />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
