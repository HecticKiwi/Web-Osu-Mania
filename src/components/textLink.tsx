import Link from "next/link";
import { ComponentProps } from "react";

const TextLink = ({ ...props }: ComponentProps<typeof Link>) => {
  return (
    <Link
      className="text-primary focus-within:underline hover:underline"
      prefetch={false}
      {...props}
    ></Link>
  );
};

export default TextLink;
