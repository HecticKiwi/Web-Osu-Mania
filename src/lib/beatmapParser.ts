import { Settings } from "@/components/providers/settingsProvider";
import { COLUMN_KEYS_ARRAY, config } from "@/osuMania/constants";
import JSZip from "jszip";
import { addDelay as addDelay } from "./audio";
import { BeatmapConfig } from "@/types";

export type Config = {
  title: string;
  artist: string;
  version: string;
  creator: string;
  keyCount: number;
  od: number;
};

export interface BeatmapSetRecord {
  map: HitObject[];
  audio: AudioFile;
  backgroundUrl: string;
  meta: Config;
  beatmapConfig: BeatmapConfig;
}

export type HitObject = Tap | HoldBody | HoldTail;

export type Tap = {
  type: TYPE.TAP;
  column: number;
  time: number;
  hitSound: number;
};

export type HoldBody = {
  type: TYPE.HOLD_BODY;
  column: number;
  time: number;
  hitSound: number;
  endTime: number;
};

export type HoldTail = {
  type: TYPE.HOLD_TAIL;
  column: number;
  time: number;
  hitSound: number;
};

export type AudioFile = {
  url: string;
  extension: string;
};

export enum TYPE {
  TAP,
  HOLD_BODY,
  HOLD_TAIL,
}

export const parseOsz = async (blob: Blob, beatmapId: number) => {
  const zip = await JSZip.loadAsync(blob);

  // Locate .osu file
  const osuFiles = Object.keys(zip.files).filter((filename) =>
    filename.endsWith(".osu"),
  );

  let osuFileData;
  for (const file of osuFiles) {
    const fileData = await zip.files[file].async("text");

    if (fileData.includes(`BeatmapID:${beatmapId}`)) {
      osuFileData = fileData;
    }
  }

  if (!osuFileData) {
    throw new Error(".osu file not found");
  }

  const lines = osuFileData?.split("\r\n");

  const meta = parseConfig(lines);

  const beatmapConfig: BeatmapConfig = {
    columnCount: meta.keyCount,
    columnKeys: COLUMN_KEYS_ARRAY[meta.keyCount],
    od: meta.od,
  };

  const { hitObjects: map, delay } = parseMap(lines, meta.keyCount);

  // Audio file

  const audioFilename = getLineValue(lines, "AudioFilename");
  if (!audioFilename) {
    throw new Error("Didn't find the audio filename");
  }

  const audioExtension = audioFilename.split(".").pop();

  if (!audioExtension) {
    throw new Error("No audio extension");
  }

  const audioFile = findFile(zip, audioFilename);
  const audioBlob = await audioFile.async("blob");

  const delayedAudioBlob = await addDelay(audioBlob, delay / 1000);

  const audioUrl = URL.createObjectURL(delayedAudioBlob);

  const audio: AudioFile = {
    url: audioUrl,
    extension: audioExtension,
  };

  // Background image

  const backgroundFilename = lines
    .find((line) => line.startsWith("0,0,"))
    ?.split(",")[2]
    .replaceAll('"', "");

  if (!backgroundFilename) {
    throw new Error("Didn't find the bg filename");
  }

  const backgroundFile = findFile(zip, backgroundFilename);

  const backgroundBlob = await backgroundFile.async("blob");
  const backgroundUrl = URL.createObjectURL(backgroundBlob);

  return {
    map,
    audio,
    backgroundFile,
    backgroundUrl,
    meta,
    beatmapConfig,
  };
};

function findFile(zip: JSZip, filenameToFind: string) {
  const lowercaseFilename = filenameToFind.toLowerCase();

  return zip.files[
    Object.keys(zip.files).find(
      (key) => key.toLowerCase() === lowercaseFilename,
    )!
  ];
}

export function parseMap(lines: string[], columnCount: number) {
  const hitObjects: HitObject[] = [];

  const startIndex = lines.indexOf("[HitObjects]") + 1;
  const endIndex = lines.findIndex((line, i) => line === "" && i > startIndex);

  // https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29#holds-(osu!mania-only)
  const hitObjectData = lines.slice(startIndex, endIndex);
  hitObjectData.forEach((hitObject, i) => {
    const [x, y, time, type, hitSound, endTime] = hitObject
      .split(":", 1)[0]
      .split(",")
      .map((number) => Number(number));

    const column = Math.floor((x * columnCount) / 512.0);

    if (type === 1) {
      hitObjects.push({
        type: TYPE.TAP,
        column,
        time,
        hitSound: 1,
      });
    } else if (type === 128) {
      hitObjects.push({
        type: TYPE.TAP,
        column,
        time,
        hitSound: 1,
      });

      hitObjects.push({
        type: TYPE.HOLD_BODY,
        column,
        time,
        hitSound: 1,
        endTime,
      });

      hitObjects.push({
        type: TYPE.HOLD_TAIL,
        column,
        time: endTime,
        hitSound: 1,
      });
    }
  });

  // Ensure at least 1 second before the first hit object
  const delay = Math.max(1000 - hitObjects[0].time, 0);
  hitObjects.forEach((hitObject) => {
    hitObject.time += delay;
    if (hitObject.type === TYPE.HOLD_BODY) {
      hitObject.endTime += delay;
    }
  });

  return {
    hitObjects,
    delay,
  };
}

export function parseConfig(lines: string[]): Config {
  const title = getLineValue(lines, "Title");
  const artist = getLineValue(lines, "Artist");
  const version = getLineValue(lines, "Version");
  const creator = getLineValue(lines, "Creator");

  const keyCount = Number(getLineValue(lines, "CircleSize"));
  const od = Number(getLineValue(lines, "OverallDifficulty"));

  return { title, artist, version, creator, keyCount, od };
}

function getLineValue(lines: string[], key: string) {
  const line = lines.find((line) => line.startsWith(`${key}:`));

  if (!line) {
    throw new Error(`No lines found with key: ${key}`);
  }

  const value = line.split(`${key}:`)[1].trim();
  return value;
}
