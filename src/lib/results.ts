import { downloadUrl } from "@/lib/utils";
import { Results } from "@/types";
import { domToPng } from "modern-screenshot";

export function getReplayFilename(
  beatmapSetId: number,
  title: string,
  version: string,
  results: Results,
) {
  const score = results.score.toLocaleString();
  const accuracy = (results.accuracy * 100).toFixed(2).replace(".", "-");
  const filename = `${beatmapSetId} ${title} ${version} Scr${score} Acc${accuracy}`;

  return filename;
}

export function downloadResults(node: HTMLDivElement, filename: string) {
  const rootStyles = getComputedStyle(document.documentElement);
  const backgroundColor = rootStyles.getPropertyValue("--background").trim();

  domToPng(node, {
    backgroundColor: `hsl(${backgroundColor})`,
    filter(el) {
      if (!(el instanceof HTMLElement)) {
        return true;
      }

      return !el.getAttribute("data-exclude");
    },
  }).then((dataUrl) => {
    downloadUrl(dataUrl, filename);
  });
}
