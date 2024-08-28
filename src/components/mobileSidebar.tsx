import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarContent from "./sidebar";
import { Button } from "./ui/button";

const MobileSidebar = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size={"icon"}
            variant={"outline"}
            className="fixed right-[40px] top-[calc(105.6px+20px)] z-20 h-14 w-14 rounded-full lg:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full max-w-[620px] bg-background/50 pt-12 sm:max-w-[620px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
