import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";

const NavLink = ({ className, ...props }: ComponentProps<typeof Link>) => {
  return (
    <Link
      className={cn("hover:text-foreground/80 transition-colors", className)}
      activeProps={{
        className: "text-foreground",
      }}
      inactiveProps={{
        className: "text-foreground/60",
      }}
      {...props}
    />
  );
};

export default NavLink;
