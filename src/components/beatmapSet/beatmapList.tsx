import { BeatmapSet } from "@/lib/osuApi";
import { parseKeysParam } from "@/lib/searchParams/keysParam";
import { parseStarsParam } from "@/lib/searchParams/starsParam";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ManiaIcon from "../maniaIcon";
import { useGameContext } from "../providers/gameProvider";
import { useHighScoresContext } from "../providers/highScoresProvider";
import HighScoreToolTip from "./highScore";

const BeatmapList = ({
  beatmapSet,
  stopPreview,
}: {
  beatmapSet: BeatmapSet;
  stopPreview: () => void;
}) => {
  const { startGame } = useGameContext();
  const searchParams = useSearchParams();
  const { highScores } = useHighScoresContext();

  const { min, max } = parseStarsParam(searchParams.get("stars"));
  const keys = parseKeysParam(searchParams.get("keys"));

  const maniaBeatmaps = beatmapSet.beatmaps.filter(
    (beatmap) => beatmap.mode === "mania",
  );

  if (maniaBeatmaps.length === 0) {
    return (
      <div className="flex max-h-[500px] flex-col gap-2 overflow-hidden rounded-xl">
        <div className="flex flex-col gap-2 overflow-auto p-2 scrollbar scrollbar-track-card">
          <p className="text-balance p-4 text-center text-muted-foreground">
            This beatmap set doesn't have any osu!mania beatmaps.
          </p>
        </div>
      </div>
    );
  }

  const filteredBeatmaps = maniaBeatmaps
    .filter(
      // For mania, CS is the keycount (e.g. CS: 4 means 4K)
      (beatmap) => !keys.length || keys.includes(beatmap.cs.toString()),
    )
    .filter(
      (beatmap) =>
        beatmap.difficulty_rating >= min && beatmap.difficulty_rating <= max,
    );

  return (
    <div className="flex max-h-[500px] flex-col gap-2 overflow-hidden rounded-xl">
      <div className="flex flex-col gap-2 overflow-auto p-2 scrollbar scrollbar-track-card">
        {filteredBeatmaps.length === 0 && (
          <p className="text-balance p-4 text-center text-muted-foreground">
            No beatmaps found matching your filters. Please adjust or{" "}
            <Link href={"/"} className="text-primary focus-within:underline">
              reset
            </Link>{" "}
            your filters.
          </p>
        )}
        {filteredBeatmaps.length > 0 &&
          filteredBeatmaps
            .sort((a, b) => a.difficulty_rating - b.difficulty_rating)
            .map((beatmap) => {
              const highScore = highScores[beatmapSet.id]?.[beatmap.id];

              return (
                <button
                  key={beatmap.id}
                  className="flex items-center gap-3 rounded p-2 text-start transition hover:bg-white/5"
                  onClick={() => {
                    stopPreview();
                    startGame(beatmap.id);
                  }}
                >
                  <ManiaIcon
                    difficultyRating={beatmap.difficulty_rating}
                    className="shrink-0"
                  />

                  <div className="grow">
                    <p className="line-clamp-1">{beatmap.version}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">
                        {beatmap.difficulty_rating.toFixed(2)}★
                      </p>

                      {highScore && <HighScoreToolTip highScore={highScore} />}
                    </div>
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
};

export default BeatmapList;
