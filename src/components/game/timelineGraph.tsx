import { JUDGEMENT_COLORS } from "@/osuMania/constants";
import type { Judgement } from "@/types";
import {
  CartesianGrid,
  ComposedChart,
  Dot,
  Line,
  ReferenceLine,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TimelineDataPoint = {
  time: number;
  error: number;
  judgement: Judgement;
  health: number;
};

function formatTime(ms: number, includeMs: boolean = false): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const timestamp = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  if (includeMs) {
    const milliseconds = Math.floor(ms % 1000);
    return `${timestamp}.${milliseconds.toString().padStart(3, "0")}`;
  }

  return timestamp;
}

const TimelineGraph = ({ data }: { data: TimelineDataPoint[] }) => {
  const errorAbsMax = Math.max(...data.map((d) => Math.abs(d.error)));
  const firstHitTime = data[0].time;

  return (
    <ComposedChart
      className="h-75 max-h-75 w-full text-xs"
      responsive
      data={data}
    >
      <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
      <XAxis
        dataKey="time"
        type="number"
        domain={["dataMin", "dataMax"]}
        tickFormatter={(ms) => formatTime(ms - firstHitTime)}
        tickCount={10}
      />
      <YAxis
        yAxisId="health"
        orientation="left"
        domain={[0, 1]}
        ticks={[0, 0.25, 0.5, 0.75, 1]}
        tickFormatter={(value) => `${value * 100}%`}
        label={{
          value: "Health",
          angle: -90,
          position: "left",
          style: {
            textAnchor: "middle",
          },
          offset: -10,
          fontSize: 14,
        }}
      />
      <YAxis
        yAxisId="error"
        orientation="right"
        domain={[-errorAbsMax, errorAbsMax]}
        ticks={[
          -errorAbsMax,
          -errorAbsMax / 2,
          0,
          errorAbsMax / 2,
          errorAbsMax,
        ]}
        tickFormatter={(value) => value}
        label={{
          value: "Hit Error (ms)",
          angle: 90,
          position: "right",
          style: {
            textAnchor: "middle",
          },
          offset: -10,
          fontSize: 14,
        }}
      />
      <ReferenceLine
        yAxisId={"error"}
        y={0}
        stroke="var(--color-judgement-perfect)"
        opacity={0.1}
      />
      <Line
        yAxisId={"health"}
        dataKey="health"
        strokeWidth={1.5}
        stroke="var(--color-primary)"
        dot={false}
      />
      <Scatter
        yAxisId="error"
        dataKey="error"
        activeShape={(dataPoint) => {
          const judgement = dataPoint.payload.judgement as Judgement;

          return (
            <Dot
              cx={dataPoint.cx}
              cy={dataPoint.cy}
              r={4}
              fill={JUDGEMENT_COLORS[judgement]}
            />
          );
        }}
        shape={(dataPoint) => {
          const judgement = dataPoint.payload.judgement as Judgement;

          return (
            <Dot
              cx={dataPoint.cx}
              cy={dataPoint.cy}
              r={1}
              fill={JUDGEMENT_COLORS[judgement]}
            />
          );
        }}
      />
      <Tooltip
        content={({ active, payload, label }) => {
          if (!payload.length) {
            return <div>No data</div>;
          }

          const dataItem = payload[0].payload as TimelineDataPoint;

          return (
            <div className="bg-background rounded-lg border p-2 shadow-sm">
              <p className="text-muted-foreground">
                {formatTime(dataItem.time, true)}
              </p>
              <div className="grid grid-cols-2 gap-1">
                <div>Health:</div>
                <div className="text-primary">
                  {Math.round(dataItem.health * 100)}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div>Hit Error:</div>
                <div style={{ color: JUDGEMENT_COLORS[dataItem.judgement] }}>
                  {Math.round(dataItem.error)}ms
                </div>
              </div>
            </div>
          );
        }}
      />
    </ComposedChart>
  );
};

export default TimelineGraph;
