import { cn, getClassNamesForGrade } from "@/lib/utils";
import { Grade } from "@/types";

const LetterGradeCard = ({ grade }: { grade: Grade | "Failed" }) => {
  const getEffects = () => {
    switch (grade) {
      case "S":
        return (
          <>
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-sparkle absolute h-0.5 w-0.5 rounded-full bg-yellow-200"
                style={{
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: "0 0 10px rgba(253,224,71,0.8)",
                }}
              />
            ))}
          </>
        );
      case "SS":
        return (
          <>
            {/* Sparkles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="animate-sparkle absolute h-1 w-1 rounded-full bg-yellow-200"
                style={{
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: "0 0 10px rgba(253,224,71,0.8)",
                }}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const textClassNames = getClassNamesForGrade(grade);
  const effects = getEffects();

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-center text-3xl font-semibold text-primary">
        Grade
      </h3>

      <div className="relative">
        {effects}
        <div className={cn("font-black", textClassNames)}>{grade}</div>
      </div>
    </div>
  );
};

export default LetterGradeCard;
