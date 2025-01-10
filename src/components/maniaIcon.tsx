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
          "flex h-[40px] w-[40px] items-center justify-center gap-[4px] rounded-full border-[3px] border-white",
          className,
        )}
        style={{ backgroundColor: difficultyRatingToRgba(difficultyRating) }}
      >
        <div className="h-[12px] w-[4px] rounded-full bg-white"></div>
        <div className="h-[25px] w-[4px] rounded-full bg-white"></div>
        <div className="h-[12px] w-[4px] rounded-full bg-white"></div>
      </div>
    </>
  );
};

export default ManiaIcon;
