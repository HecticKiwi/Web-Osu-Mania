import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarContent from "./sidebar";
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
            className="fixed right-4 top-6 z-20 h-14 w-14 rounded-full sm:right-6 lg:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full max-w-[620px] bg-background/50 pt-12 sm:max-w-[620px]">
          <DialogTitle className="sr-only">Sidebar</DialogTitle>
          <DialogDescription className="sr-only">
            Edit filters, mods, and settings
          </DialogDescription>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
