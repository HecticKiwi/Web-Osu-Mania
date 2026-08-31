import { getDiffColour, getDiffTextColour } from "@/lib/colors";
import { cn } from "@/lib/utils";

const DifficultyBadge = ({
  difficultyRating,
  className,
}: {
  difficultyRating: number;
  className?: string;
}) => {
  return (
    <div
      className={cn("w-fit rounded-full px-2 font-mono text-sm", className)}
      style={{
        backgroundColor: getDiffColour(difficultyRating),
        color: getDiffTextColour(difficultyRating),
      }}
    >
      {difficultyRating.toFixed(2)}★
    </div>
  );
};

export default DifficultyBadge;
