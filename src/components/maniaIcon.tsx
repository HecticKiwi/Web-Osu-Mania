import { cn, difficultyRatingToRgba } from "@/lib/utils";

const ManiaIcon = ({
  className,
  difficultyRating,
}: {
  className?: string;
  difficultyRating: number;
}) => {
  return (
    <>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center gap-1 rounded-full border-[3px] border-white",
          className,
        )}
        style={{ backgroundColor: difficultyRatingToRgba(difficultyRating) }}
      >
        <div className="h-3 w-1 rounded-full bg-white"></div>
        <div className="h-6.25 w-1 rounded-full bg-white"></div>
        <div className="h-3 w-1 rounded-full bg-white"></div>
      </div>
    </>
  );
};

export default ManiaIcon;
