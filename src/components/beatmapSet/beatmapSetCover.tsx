import { BeatmapSet, Status } from "@/lib/osuApi";
import { cn, secondsToMMSS } from "@/lib/utils";
import Image from "next/image";
import { useSettingsStore } from "../../stores/settingsStore";

const getStatusClass = (status: Status) => {
  switch (status) {
    case "ranked":
      return "bg-green-400";
    case "qualified":
      return "bg-blue-400";
    case "loved":
      return "bg-pink-400";
    case "pending":
      return "bg-yellow-400";
    case "graveyard":
      return "bg-black";
    case "wip":
      return "bg-orange-400";
  }
};

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
      <div
        className={cn(
          "mt-auto w-fit rounded-full px-1.5 text-xs font-bold text-gray-900",
          getStatusClass(beatmapSet.status),
        )}
      >
        {beatmapSet.status.toUpperCase()}
      </div>
      <div className="mt-0.5 w-full truncate text-xl">{title}</div>
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
