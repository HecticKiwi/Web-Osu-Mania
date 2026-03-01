import { JUDGEMENTS, JUDGEMENT_COLORS } from "@/osuMania/constants";
import type { PlayResults } from "@/types";
import { useMemo } from "react";

export function JudgementChart({ playResults }: { playResults: PlayResults }) {
  const total = useMemo(
    () => JUDGEMENTS.reduce((sum, j) => sum + playResults[j], 0 as number),
    [playResults],
  );

  return (
    <div className="flex flex-col gap-2.5">
      {JUDGEMENTS.map((judgement) => {
        const count = playResults[judgement];

        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <JudgementRow
            key={judgement}
            label={judgement === 320 ? "300g" : judgement.toString()}
            count={count}
            percentage={percentage}
            barWidth={percentage}
            color={JUDGEMENT_COLORS[judgement]}
          />
        );
      })}
    </div>
  );
}

function JudgementRow({
  label,
  count,
  percentage,
  barWidth,
  color,
}: {
  label: string;
  count: number;
  percentage: number;
  barWidth: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <div
        className="w-10 shrink-0 text-right font-mono font-bold"
        style={{ color }}
      >
        {label}
      </div>

      {/* Bar container */}
      <div className="bg-secondary/50 h-7 flex-1 overflow-hidden rounded-sm">
        {/* Filled bar */}
        <div
          className="h-full rounded-sm"
          style={{
            width: `${barWidth}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Count + Percentage */}
      <div className="flex shrink-0 items-center justify-end gap-2">
        <span className="w-12 text-right font-mono font-semibold">{count}</span>
        <span className="text-muted-foreground w-14 font-mono text-sm">
          {percentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
