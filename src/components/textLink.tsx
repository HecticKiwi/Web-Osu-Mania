import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";

const TextLink = ({ ...props }: ComponentProps<typeof Link>) => {
  return (
    <Link
      className="text-primary focus-within:underline hover:underline"
      {...props}
    ></Link>
  );
};

export default TextLink;
