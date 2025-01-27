import { BeatmapSet } from "@/lib/osuApi";
import { secondsToMMSS } from "@/lib/utils";
import Image from "next/image";
import { useSettingsContext } from "../providers/settingsProvider";

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
          "absolute inset-0 -z-10 brightness-[0.3] transition duration-300 group-hover:brightness-[0.5]"
        }
      >
        <Image
          src={beatmapSet.covers.cover}
          alt="Beatmap Set Cover"
          fill
          className="object-cover"
          sizes="720px"
        />
      </span>

      {/* Details */}
      <div className="mt-auto w-full truncate text-xl">{title}</div>
      <div className="flex w-full items-end justify-between gap-8">
        <span className="truncate text-primary">by {artist}</span>
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
