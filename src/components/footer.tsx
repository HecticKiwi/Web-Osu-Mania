import { Heart } from "lucide-react";
import TextLink from "./textLink";

export function Footer() {
  return (
    <footer className="border-border/50 border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-center">
        <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
          Made with
          <Heart className="fill-primary text-primary size-3.5" />
          by{" "}
          <TextLink to={"https://github.com/hectickiwi"} target="_blank">
            HecticKiwi
          </TextLink>
        </p>
        <p className="text-muted-foreground text-sm">
          If you enjoy this project, consider becoming a{" "}
          <TextLink
            to={"https://github.com/sponsors/HecticKiwi"}
            target="_blank"
          >
            GitHub Sponsor
          </TextLink>
        </p>
      </div>
    </footer>
  );
}
