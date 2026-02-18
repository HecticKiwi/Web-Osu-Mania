import type { ReplayData } from "@/osuMania/systems/replayRecorder";
import type { CoverType, Settings } from "@/stores/settingsStore";
import { defaultSettings } from "@/stores/settingsStore";
import type { PlayResults } from "@/types";
import { compressSync } from "fflate";
import { toast } from "sonner";
import type { BeatmapData } from "./beatmapParser";
import { getReplayFilename } from "./results";
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
  perfect: 9,
  perfectSs: 10,
} as const;
type BooleanMod = keyof typeof ModBits;

export type EncodedMods = {
  bits: number;
  rate: number;
  hpOverride: number | null;
  odOverride: number | null;
  cover: {
    type: CoverType;
    amount: number;
  } | null;
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
    hpOverride: mods.hpOverride,
    odOverride: mods.odOverride,
    cover: mods.cover,
  };
}

export function decodeMods(data: EncodedMods): Settings["mods"] {
  const mods: Partial<Settings["mods"]> = {
    playbackRate: data.rate ?? 1,
    hpOverride: data.hpOverride,
    odOverride: data.odOverride,
    cover: data.cover,
  };

  for (const modName in ModBits) {
    const key = modName as BooleanMod;
    mods[key] = (data.bits & (1 << ModBits[key])) !== 0;
  }

  return { ...defaultSettings.mods, ...mods };
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
    const encoded = new TextEncoder().encode(replayDataString);
    const compressed = compressSync(encoded);
    const blob = new Blob([compressed as BlobPart], {
      type: "application/octet-stream",
    });

    const filename = `${getReplayFilename(beatmapData.beatmapId, beatmapData.metadata.title, beatmapData.metadata.version, results)}.womr`;

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
