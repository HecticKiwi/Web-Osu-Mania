import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ComponentProps } from "react";

const NavLink = ({ className, ...props }: ComponentProps<typeof Link>) => {
  return (
    <Link
      className={cn("transition-colors hover:text-foreground/80", className)}
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
