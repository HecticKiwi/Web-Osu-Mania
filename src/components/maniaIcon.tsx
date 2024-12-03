import { cn } from "@/lib/utils";

const ManiaIcon = ({
  className,
  difficultyRating,
}: {
  className?: string;
  difficultyRating: number;
}) => {
  // https://osu.ppy.sh/wiki/en/Beatmap/Difficulty#difficulty-and-star-rating
  const bg =
    difficultyRating < 2
      ? "bg-[rgba(102,204,255,0.8)]" // Blue
      : difficultyRating < 2.7
        ? "bg-[rgba(136,179,0,0.8)]" // Green
        : difficultyRating < 4
          ? "bg-[rgba(255,204,34,0.8)]" // Yellow
          : difficultyRating < 5.3
            ? "bg-[rgba(255,78,111,0.8)]" // Orange
            : difficultyRating < 6.5
              ? "bg-[rgba(255,102,170,0.8)]" // Magenta
              : "bg-[rgba(101,99,212,0.8)]"; // Purple

  return (
    <>
      <div
        className={cn(
          "flex h-[40px] w-[40px] items-center justify-center gap-[4px] rounded-full border-[3px] border-white",
          bg,
          className,
        )}
      >
        <div className="h-[12px] w-[4px] rounded-full bg-white"></div>
        <div className="h-[25px] w-[4px] rounded-full bg-white"></div>
        <div className="h-[12px] w-[4px] rounded-full bg-white"></div>
      </div>
    </>
  );
};

export default ManiaIcon;
