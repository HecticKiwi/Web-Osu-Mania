"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsClient } from "@uidotdev/usehooks";
import { CircleAlert } from "lucide-react";
import Link from "next/link";

const UrlWarning = () => {
  const isClient = useIsClient();

  if (!isClient || window.location.host !== "web-osu-mania.vercel.app") {
    return null;
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            variant={"outline"}
            className="fixed left-4 top-6 z-20 h-14 w-14 rounded-full sm:left-6 "
          >
            <CircleAlert className="text-orange-400" />
          </Button>
        </DialogTrigger>
        <DialogContent className="space-y-0">
          <DialogHeader>
            <DialogTitle>Web osu!mania is Moving to a New URL!</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p>
              This site has a new URL:<br></br>
              <Link
                href={"https://web-osu-mania.pages.dev/"}
                className="text-primary focus-within:underline hover:underline"
                target="_blank"
                prefetch={false}
              >
                https://web-osu-mania.pages.dev/
              </Link>
            </p>

            <p>
              Update your bookmarks and use that URL from now on! The old{" "}
              <Link
                href={"https://web-osu-mania.vercel.app/"}
                className="text-primary focus-within:underline hover:underline"
                target="_blank"
                prefetch={false}
              >
                https://web-osu-mania.vercel.app/
              </Link>{" "}
              URL will be removed at some point in the future.
            </p>

            <p>
              If you're wondering why, this site got more popular than I thought
              and I'm getting close to exceeding Vercel's free tier hosting
              limits. I'm just a student and I don't want to pay anything for
              this project. So, I'm moving to Cloudflare which has some
              limitations, but also a way better free tier. You shouldn't notice
              any changes (hopefully).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UrlWarning;
