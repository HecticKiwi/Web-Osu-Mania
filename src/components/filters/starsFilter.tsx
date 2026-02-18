import { parseStarsParam } from "@/lib/searchParams/starsParam";
import { cn } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import StarsSlider from "./starsSlider";

export const minDisplayValue = 0;
export const maxDisplayValue = 10;

const DifficultyFilter = ({ className }: { className?: string }) => {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const { min, max } = parseStarsParam(
    typeof search.stars === "string" ? search.stars : undefined,
  );

  const handleValueCommit = ([newMin, newMax]: number[]) => {
    navigate({
      to: "/",
      search: {
        ...search,
        stars:
          newMin !== minDisplayValue || newMax !== maxDisplayValue
            ? `${newMin === minDisplayValue ? "null" : newMin}-${newMax === maxDisplayValue ? "null" : newMax}`
            : undefined,
      },
    });
  };

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Difficulty</span>

        <StarsSlider
          key={`${min}-${max}`}
          initialMin={min ?? minDisplayValue}
          initialMax={max ?? maxDisplayValue}
          onCommit={handleValueCommit}
        />
      </div>
    </>
  );
};

export default DifficultyFilter;
