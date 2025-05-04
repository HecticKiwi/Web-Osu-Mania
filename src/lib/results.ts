import { downloadUrl } from "@/lib/utils";
import { Results } from "@/types";
import { domToPng } from "modern-screenshot";
import { BeatmapData } from "./beatmapParser";

export function getReplayFilename(beatmapData: BeatmapData, results: Results) {
  const score = results.score.toLocaleString();
  const accuracy = (results.accuracy * 100).toFixed(2).replace(".", "-");
  const filename = `${beatmapData.beatmapSetId} ${beatmapData.metadata.title} ${beatmapData.version} Scr${score} Acc${accuracy}`;

  return filename;
}

export function downloadResults(node: HTMLDivElement, filename: string) {
  const rootStyles = getComputedStyle(document.documentElement);
  const backgroundColor = rootStyles.getPropertyValue("--background").trim();

  domToPng(node, {
    backgroundColor: `hsl(${backgroundColor})`,
  }).then((dataUrl) => {
    downloadUrl(dataUrl, filename);
  });
}
