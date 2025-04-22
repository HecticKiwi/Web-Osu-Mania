import { Settings } from "@/components/providers/settingsProvider";
import { ReplayData } from "@/osuMania/systems/replayRecorder";
import { PlayResults } from "@/types";
import { deflate } from "pako";
import { toast } from "sonner";
import { BeatmapData } from "./beatmapParser";
import { downloadBlob } from "./utils";

const ModBits = {
  autoplay: 0,
  easy: 1,
  hardRock: 2,
  mirror: 3,
  random: 4,
  constantSpeed: 5,
  holdOff: 6,
  noFail: 7,
  suddenDeath: 8,
} as const;
type BooleanMod = keyof typeof ModBits;

export type EncodedMods = {
  bits: number;
  rate: number;
};

export function encodeMods(mods: Settings["mods"]): EncodedMods {
  let bitfield = 0;

  for (const modName in ModBits) {
    const key = modName as BooleanMod;
    if (mods[key]) {
      bitfield |= 1 << ModBits[key];
    }
  }

  return {
    bits: bitfield,
    rate: mods.playbackRate,
  };
}

export function decodeMods(data: EncodedMods): Settings["mods"] {
  const mods: Partial<Settings["mods"]> = {
    playbackRate: data.rate ?? 1,
  };

  for (const modName in ModBits) {
    const key = modName as BooleanMod;
    mods[key] = (data.bits & (1 << ModBits[key])) !== 0;
  }

  return mods as Settings["mods"];
}

export async function downloadReplay(
  replayData: ReplayData | null,
  beatmapData: BeatmapData,
  results: PlayResults,
) {
  if (!replayData) {
    toast.message("Error saving replay", {
      description: "No replay data available",
    });
    return;
  }

  try {
    const replayDataString = JSON.stringify(replayData);

    const compressed = deflate(replayDataString);

    const blob = new Blob([compressed], {
      type: "application/octet-stream",
    });

    // Generate a unique filename
    const score = results.score.toLocaleString();
    const accuracy = (results.accuracy * 100).toFixed(2).replace(".", "-");
    const filename = `${beatmapData.beatmapSetId} ${beatmapData.metadata.title} ${beatmapData.version} Scr${score} Acc${accuracy}.womr`;

    await downloadBlob(blob, filename);

    toast.message("Replay saved successfully", {
      description: `Saved as ${filename}`,
      duration: 5000,
    });
  } catch (error: any) {
    toast.message("Error Downloading Replay", {
      description: error.message,
    });
  }
}
