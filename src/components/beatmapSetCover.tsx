import { BeatmapSet } from "@/lib/osuApi";
import { secondsToMMSS } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSettingsContext } from "./providers/settingsProvider";
import { Button } from "./ui/button";

const BeatmapSetCover = ({ beatmapSet }: { beatmapSet: BeatmapSet }) => {
  const { settings } = useSettingsContext();

  const artist = settings.preferMetadataInOriginalLanguage
    ? beatmapSet.artist_unicode
    : beatmapSet.artist;

  const title = settings.preferMetadataInOriginalLanguage
    ? beatmapSet.title_unicode
    : beatmapSet.title;

  return (
    <>
      {/* Background cover */}
      <span
        className={
          "absolute inset-0 -z-10 brightness-[0.3] transition duration-300 group-focus-within:brightness-[0.5] group-hover:brightness-[0.5]"
        }
      >
        <Image
          src={beatmapSet.covers.cover}
          alt="Beatmap Set Cover"
          fill
          // priority
          className="object-cover"
          sizes="720px"
        />
      </span>

      <Button
        asChild
        variant={"secondary"}
        size={"icon"}
        className="h-8 w-8 self-end bg-secondary/60 focus-within:bg-secondary hover:bg-secondary"
        onClick={(e) => e.stopPropagation()}
        title="Go to osu! beatmap page"
      >
        <Link
          href={`https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
          target="_blank"
          prefetch={false}
        >
          <ExternalLink className="h-5 w-5" />
        </Link>
      </Button>

      {/* Details */}
      <div className="mt-auto line-clamp-1 text-xl">{title}</div>
      <div className="flex w-full items-end justify-between gap-8">
        <span className="line-clamp-1 text-primary">by {artist}</span>
        <span className="text-sm text-muted-foreground">
          {secondsToMMSS(
            Math.max(
              ...beatmapSet.beatmaps.map((beatmap) => beatmap.total_length),
            ),
          )}
        </span>
      </div>
    </>
  );
};

export default BeatmapSetCover;
