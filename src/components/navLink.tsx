"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

const NavLink = ({ ...props }: ComponentProps<typeof Link>) => {
  const pathname = usePathname();

  return (
    <>
      <Link
        prefetch={false}
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === props.href ? "text-foreground" : "text-foreground/60",
        )}
        {...props}
      ></Link>
    </>
  );
};

export default NavLink;
