import type { Judgement } from "@/types";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

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

const getCssVar = (name: string) => {
  if (typeof window === "undefined") {
    return "";
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
};

// For some reason, the HSL values must be separated by commas or the elements disappear on hover
export const JUDGEMENT_COLORS: Record<Judgement, string> = {
  320: `hsl(${getCssVar("--judgement-perfect").replaceAll(" ", ",")})`,
  300: `hsl(${getCssVar("--judgement-great").replaceAll(" ", ",")})`,
  200: `hsl(${getCssVar("--judgement-good").replaceAll(" ", ",")})`,
  100: `hsl(${getCssVar("--judgement-ok").replaceAll(" ", ",")})`,
  50: `hsl(${getCssVar("--judgement-meh").replaceAll(" ", ",")})`,
  0: `hsl(${getCssVar("--judgement-miss").replaceAll(" ", ",")})`,
};

const TimelineGraph = ({ data }: { data: TimelineDataPoint[] }) => {
  const errorAbsMax = useMemo(
    () =>
      data.length ? Math.max(...data.map((d) => Math.abs(d.error))) || 10 : 10,
    [data],
  );

  const options = useMemo(
    (): echarts.EChartsOption => ({
      animation: false,
      textStyle: {
        fontFamily: "Varela Round",
        color: "#666",
      },
      backgroundColor: "transparent",
      grid: {
        left: "0%",
        right: "0%",
        top: "0%",
        bottom: "0%",
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: `hsl(${getCssVar("--background")})`,
        borderColor: `hsl(${getCssVar("--border")})`,
        padding: 8,
        borderRadius: 6,
        textStyle: { color: "#fff", fontSize: 12 },
        formatter: (params: any) => {
          // Find the data point from the scatter or line series
          const item = params[0].data;
          const original = item.raw as TimelineDataPoint;

          return `
            <div style="font-family: 'Varela Round';">
              <div style="color: ${getCssVar("--color-muted-foreground")}" className="text-primary-foreground">${formatTime(original.time, true)}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <span>Health:</span>
                <span style="color: ${getCssVar("--color-primary")};">${Math.round(original.health * 100)}%</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <span>Hit Error:</span>
                <span style="color: ${JUDGEMENT_COLORS[original.judgement]}">${Math.round(original.error)}ms</span>
              </div>
            </div>
          `;
        },
      },
      xAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            opacity: 0.5,
          },
        },
        axisLine: {
          lineStyle: {
            color: "#666",
          },
        },
        axisLabel: {
          formatter: (val: number) => formatTime(val - data[0]?.time),
          color: "#666",
        },
        min: data[0]?.time,
        max: data[data.length - 1]?.time,
      },
      yAxis: [
        {
          type: "value",
          name: "Health",
          min: 0,
          max: 1,
          interval: 0.25,
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          axisLabel: { formatter: (v: number) => `${v * 100}%`, color: "#666" },
          splitLine: {
            show: false,
          },
          nameLocation: "middle",
          nameRotate: 90,
          nameGap: -10,
          nameTextStyle: {
            fontSize: 14,
            color: "#888",
          },
        },
        {
          type: "value",
          name: "Hit Error (ms)",
          min: -errorAbsMax,
          max: errorAbsMax,
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          axisLabel: { color: "#666" },
          splitLine: {
            show: false,
          },
          nameLocation: "middle",
          nameRotate: -90,
          nameTextStyle: {
            fontSize: 14,
            color: "#888",
          },
        },
      ],
      series: [
        {
          name: "Health",
          type: "line",
          yAxisIndex: 0,
          data: data.map((d) => ({ value: [d.time, d.health], raw: d })),
          showSymbol: false,
          lineStyle: {
            width: 1.5,
            color: getCssVar("--color-primary").replaceAll(" ", ","),
          },
          z: 2,
        },
        {
          name: "Error",
          type: "scatter",
          yAxisIndex: 1,
          largeThreshold: 2000,
          symbolSize: 3,
          data: data.map((d) => ({
            value: [d.time, d.error],
            itemStyle: {
              color: JUDGEMENT_COLORS[d.judgement],
            },
            raw: d,
            symbolSize: 2,
          })),
          z: 3,
          markLine: {
            silent: true,
            symbol: "none",
            label: { show: false },
            lineStyle: {
              color: JUDGEMENT_COLORS[320],
              type: "solid",
              width: 1,
              opacity: 0.1,
            },
            data: [
              {
                yAxis: 0,
              },
            ],
          },
        },
      ],
    }),
    [data, errorAbsMax],
  );

  return (
    <div className="h-75">
      {/* Using ECharts instead of Recharts as it is significantly faster for large datasets. */}
      <ReactECharts
        option={options}
        style={{ height: "100%", width: "100%" }}
        theme="dark"
      />
    </div>
  );
};

export default TimelineGraph;
