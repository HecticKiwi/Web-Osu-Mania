import { Settings } from "@/components/providers/settingsProvider";
import { Howl } from "howler";
import JSZip from "jszip";
import { addDelay } from "./audio";
import { getSettings } from "./utils";

export type Sounds = { [key: string]: Howl };

export type Metadata = {
  title: string;
  artist: string;
  version: string;
  creator: string;
};

export type Difficulty = {
  keyCount: number;
  od: number;
};

export const sampleSets = ["default", "normal", "soft", "drum"] as const;
export type SampleSet = (typeof sampleSets)[number];

export type TimingPoint = {
  time: number;
  sampleSet: SampleSet;
  sampleIndex: number;
  volume: number;
};

export interface BeatmapData {
  timingPoints: TimingPoint[];
  hitObjects: HitObject[];
  audio: AudioFile;
  backgroundUrl: string;
  metadata: Metadata;
  difficulty: Difficulty;
  sounds: Sounds;
}

export type HitObject = TapData | HoldData;

export type HitSound = {
  normal: boolean;
  whistle: boolean;
  finish: boolean;
  clap: boolean;
};

export type HitSample = {
  normalSet: SampleSet;
  additionSet: SampleSet;
  index: number;
  volume: number;
  filename?: string;
};

export type TapData = {
  type: "tap";
  column: number;
  time: number;
  hitSound: HitSound;
  hitSample: HitSample;
};

export type HoldData = {
  type: "hold";
  column: number;
  time: number;
  endTime: number;
};

export type AudioFile = {
  url: string;
  extension: string;
};

export const parseOsz = async (
  blob: Blob,
  beatmapId: number,
): Promise<BeatmapData> => {
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

  // Parse .osu file sections
  const metadata = parseMetadata(lines);
  const difficulty = parseDifficulty(lines);
  const { hitObjects, delay } = parseHitObjects(lines, difficulty.keyCount);
  const timingPoints = parseTimingPoints(lines, delay);

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

  // Beatmap sounds

  const sounds: Sounds = {};

  const audioExtensions = ["wav", "mp3", "ogg"];
  const audioFiles = Object.keys(zip.files).filter((fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension && audioExtensions.includes(extension);
  });

  for (const fileName of audioFiles) {
    const fileData = await zip.files[fileName].async("blob");
    sounds[fileName] = new Howl({
      src: [URL.createObjectURL(fileData)],
      format: fileName.split(".").pop(),
      preload: true,
      onloaderror: (_, e) => console.warn(e),
    });
  }

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
    timingPoints,
    hitObjects,
    audio,
    backgroundUrl,
    metadata,
    difficulty,
    sounds,
  };
};

function findFile(zip: JSZip, filename: string) {
  const lowercaseFilename = filename.toLowerCase();

  return zip.files[
    Object.keys(zip.files).find(
      (key) => key.toLowerCase() === lowercaseFilename,
    )!
  ];
}

export function parseHitObjects(lines: string[], columnCount: number) {
  const startIndex = lines.indexOf("[HitObjects]") + 1;
  const endIndex = lines.findIndex((line, i) => line === "" && i > startIndex);

  // https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29#holds-(osu!mania-only)
  const hitObjects: HitObject[] = [];
  const hitObjectData = lines.slice(startIndex, endIndex);
  hitObjectData.forEach((hitObject: string, i) => {
    const [x, y, time, type, hitSoundDecimal] = hitObject
      .split(",")
      .map((number) => Number(number));
    const column = Math.floor((x * columnCount) / 512);

    const hitSoundBinaryString = hitSoundDecimal.toString(2).padStart(4, "0");
    const hitSound = {
      normal:
        hitSoundBinaryString[3] === "1" || hitSoundBinaryString === "0000",
      whistle: hitSoundBinaryString[2] === "1",
      finish: hitSoundBinaryString[1] === "1",
      clap: hitSoundBinaryString[0] === "1",
    };

    let sampleSet = hitObject.split(",")[5].split(":");

    const isHoldNote = type === 128;
    const sampleSetStartIndex = isHoldNote ? 1 : 0;

    const hitSample: HitSample = {
      normalSet: sampleSets[parseInt(sampleSet[sampleSetStartIndex])],
      additionSet: sampleSets[parseInt(sampleSet[sampleSetStartIndex + 1])],
      index: parseInt(sampleSet[sampleSetStartIndex + 2]),
      volume: parseInt(sampleSet[sampleSetStartIndex + 3]) / 100,
      filename: sampleSet[sampleSetStartIndex + 4],
    };

    hitObjects.push({
      type: "tap",
      column,
      time,
      hitSound,
      hitSample,
    });

    if (isHoldNote) {
      const endTime = parseInt(sampleSet[0]);

      hitObjects.push({
        type: "hold",
        column,
        time,
        endTime,
      });
    }
  });

  // Ensure at least 1 second before the song starts
  const { audioOffset } = getSettings();
  const delay = Math.max(1000 - hitObjects[0].time, 0);

  hitObjects.forEach((hitObject) => {
    hitObject.time += delay - audioOffset;
    if (hitObject.type === "hold") {
      hitObject.endTime += delay - audioOffset;
    }
  });

  return {
    hitObjects,
    delay,
  };
}

export function parseMetadata(lines: string[]): Metadata {
  const title = getLineValue(lines, "Title");
  const artist = getLineValue(lines, "Artist");
  const version = getLineValue(lines, "Version");
  const creator = getLineValue(lines, "Creator");

  return { title, artist, version, creator };
}

export function parseDifficulty(lines: string[]): Difficulty {
  const keyCount = Number(getLineValue(lines, "CircleSize"));
  const od = Number(getLineValue(lines, "OverallDifficulty"));

  return { keyCount, od };
}

export function parseTimingPoints(
  lines: string[],
  delay: number,
): TimingPoint[] {
  const startIndex = lines.indexOf("[TimingPoints]") + 1;
  const endIndex = lines.findIndex((line, i) => line === "" && i > startIndex);

  const timingPointLines = lines.slice(startIndex, endIndex);

  const timingPoints: TimingPoint[] = timingPointLines.map((line) => {
    const [
      time,
      beatLength,
      meter,
      sampleSet,
      sampleIndex,
      volume,
      uninherited,
      effects,
    ] = line.split(",").map((value) => Number(value));

    return {
      time: time + delay,
      sampleSet: sampleSets[sampleSet],
      sampleIndex,
      volume: volume / 100,
    };
  });

  return timingPoints;
}

function getLineValue(lines: string[], key: string) {
  const line = lines.find((line) => line.startsWith(`${key}:`));

  if (!line) {
    throw new Error(`No lines found with key: ${key}`);
  }

  const value = line.split(`${key}:`)[1].trim();
  return value;
}
