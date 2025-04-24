import { JUDGEMENTS } from "@/osuMania/constants";
import { Judgement } from "@/types";
import { Bar, BarChart, Cell, XAxis } from "recharts";
import { ChartContainer } from "../ui/chart";

const binCount = 101;
const tickCount = 11;

const judgementColors: Record<Judgement, string> = {
  320: "hsl(var(--judgement-perfect))",
  300: "hsl(var(--judgement-great))",
  200: "hsl(var(--judgement-good))",
  100: "hsl(var(--judgement-ok))",
  50: "hsl(var(--judgement-meh))",
  0: "hsl(var(--judgement-miss))",
};

export type HitError = {
  error: number;
  judgement: Judgement;
};

type Bin = {
  x: number;
} & Record<Judgement, number>;

function createTimingHistogram(
  hitErrors: HitError[],
  binCount: number,
  domain: [number, number],
): Bin[] {
  const [min, max] = domain;
  const binSize = (max - min) / (binCount - 1);

  const bins: Record<number, Record<Judgement, number>> = {};
  for (let i = 0; i < binCount; i++) {
    bins[i] = { 320: 0, 300: 0, 200: 0, 100: 0, 50: 0, 0: 0 };
  }

  hitErrors.forEach(({ error, judgement }) => {
    if (error < min || error > max) return;
    const index = Math.round((error - min) / binSize);
    const clampedIndex = Math.min(index, binCount - 1);
    bins[clampedIndex][judgement]++;
  });

  return Array.from({ length: binCount }, (_, i) => {
    const bin = bins[i];
    return {
      x: min + binSize * i,
      ...bin,
    };
  });
}

function generateSymmetricTicks(
  [min, max]: [number, number],
  tickCount: number = 11,
): number[] {
  const step = (max - min) / (tickCount - 1);
  const ticks: number[] = [];

  for (let i = 0; i < tickCount; i++) {
    const tick = min + i * step;
    ticks.push(Math.round(tick));
  }

  return ticks;
}

export default function TimingDistributionChart({
  hitErrors,
}: {
  hitErrors: HitError[];
}) {
  const min = Math.min(...hitErrors.map((e) => e.error));
  const max = Math.max(...hitErrors.map((e) => e.error));
  const absMax = Math.max(Math.abs(min), Math.abs(max));
  const domain = [-absMax, absMax] as [number, number];

  const chartData = createTimingHistogram(hitErrors, binCount, domain);
  const ticks = generateSymmetricTicks(domain, tickCount);

  return (
    <ChartContainer config={{}} className="max-h-[300px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          type="number"
          dataKey="x"
          tickLine={false}
          ticks={ticks}
          domain={([dataMin, dataMax]) => {
            const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
            return [-absMax, absMax];
          }}
          interval={"preserveStartEnd"}
        />
        {JUDGEMENTS.map((judgement) => (
          <Bar
            key={judgement}
            dataKey={judgement}
            stackId="judgement"
            radius={4}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={judgementColors[judgement as Judgement]}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
}
