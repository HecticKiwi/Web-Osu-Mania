import { BeatmapSet, Status } from "@/lib/osuApi";
import { cn, secondsToMMSS } from "@/lib/utils";
import { useSettingsStore } from "../../stores/settingsStore";

const getStatusClass = (status: Status) => {
  switch (status) {
    case "ranked":
      return "bg-[#b3ff66] text-[#394246]"; // Green
    case "qualified":
      return "bg-[#66ccff] text-[#394246]"; // Blue
    case "loved":
      return "bg-[#ff66ab] text-[#394246]"; // Pink
    case "pending":
      return "bg-[#ffd966] text-[#394246]"; // Yellow
    case "wip":
      return "bg-[#ff9966] text-[#394246]"; // Orange
    case "graveyard":
      return "bg-black text-[#5c6970]"; // Gray
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
            "bg-card absolute inset-0 -z-10 transition duration-300 group-hover:brightness-[0.5]"
          }
        ></span>
      )}
      {!hideBeatmapSetCovers && (
        <span
          className={
            "absolute inset-0 -z-10 brightness-[0.3] transition duration-300 group-hover:brightness-[0.5]"
          }
        >
          <img
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover.jpg`}
            alt="Beatmap Set Cover"
            // fill
            className="h-full w-full object-cover"
            sizes="720px"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </span>
      )}

      {/* Details */}
      <div className="mt-auto">
        {beatmapSet.status && (
          <div
            className={cn(
              "w-fit rounded-full px-1.5 text-xs font-bold",
              getStatusClass(beatmapSet.status),
            )}
          >
            {beatmapSet.status.toUpperCase()}
          </div>
        )}
        <div className="mt-0.5 w-full truncate text-xl" title={title}>
          {title}
        </div>
        <div className="flex w-full items-end justify-between gap-8">
          <span className="text-primary truncate">by {artist}</span>
          <span className="text-muted-foreground text-sm">
            {secondsToMMSS(
              Math.max(
                ...beatmapSet.beatmaps.map((beatmap) => beatmap.total_length),
              ),
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default BeatmapSetCover;
