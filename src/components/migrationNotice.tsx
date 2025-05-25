"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import TextLink from "./textLink";

export default function MigrationNotice() {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;

    if (hostname !== "webosumania.com") {
      setShowAlert(true);
    }
  }, []);

  if (!showAlert) {
    return null;
  }

  return (
    <Alert className="mb-6 bg-card">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Web osu!mania is Moving!</AlertTitle>
      <AlertDescription className="mt-2 space-y-2 text-muted-foreground">
        <p>
          The site is moving to{" "}
          <TextLink href={"https://webosumania.com"} target="_blank">
            https://webosumania.com
          </TextLink>{" "}
          as the main URL and{" "}
          <TextLink href={"https://web-osu-mania.pages.dev"} target="_blank">
            https://web-osu-mania.pages.dev
          </TextLink>{" "}
          will be retired on <strong>June 8th</strong>. Please update your
          bookmarks and migrate your data (use the backup tool in the settings
          tab) before then.
        </p>

        <p>
          After June 8th, Web osu!mania will be available at the following URLs:
        </p>

        <ol className="list-inside list-decimal">
          <li>
            <TextLink href={"https://webosumania.com"} target="_blank">
              https://webosumania.com
            </TextLink>{" "}
            (main)
          </li>
          <li>
            <TextLink
              href={"https://webosumania.hectickiwi.workers.dev"}
              target="_blank"
            >
              https://webosumania.hectickiwi.workers.dev
            </TextLink>
          </li>
          <li>
            <TextLink
              href={"https://hectickiwi.github.io/Web-Osu-Mania"}
              target="_blank"
            >
              https://hectickiwi.github.io/Web-Osu-Mania
            </TextLink>
          </li>
        </ol>
      </AlertDescription>
    </Alert>
  );
}
