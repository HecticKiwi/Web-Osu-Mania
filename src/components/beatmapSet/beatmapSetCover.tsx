import { BeatmapSet } from "@/lib/osuApi";
import { secondsToMMSS } from "@/lib/utils";
import Image from "next/image";
import { useSettingsStore } from "../../stores/settingsStore";

const BeatmapSetCover = ({ beatmapSet }: { beatmapSet: BeatmapSet }) => {
  const hideBeatmapSetCovers = useSettingsStore.use.hideBeatmapSetCovers();
  const preferMetadataInOriginalLanguage =
    useSettingsStore.use.preferMetadataInOriginalLanguage();

  const artist = preferMetadataInOriginalLanguage
    ? beatmapSet.artist_unicode
    : beatmapSet.artist;

  const title = preferMetadataInOriginalLanguage
    ? beatmapSet.title_unicode
    : beatmapSet.title;

  return (
    <>
      {/* Background cover */}
      {hideBeatmapSetCovers && (
        <span
          className={
            "absolute inset-0 -z-10 bg-card transition duration-300 group-hover:brightness-[0.5]"
          }
        ></span>
      )}
      {!hideBeatmapSetCovers && (
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
      )}

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
