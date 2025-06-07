import { Settings, useSettingsStore } from "@/stores/settingsStore";
import {
  BlobReader,
  BlobWriter,
  Entry,
  TextWriter,
  ZipReader,
} from "@zip.js/zip.js";
import { Howl } from "howler";
import { addDelay } from "./audio";
import { Beatmap } from "./osuApi";
import { decodeMods, EncodedMods } from "./replay";
import { removeFileExtension, shuffle } from "./utils";

export type HitObject = TapData | HoldData;

export type Break = {
  startTime: number;
  endTime: number;
};

export type Metadata = {
  title: string;
  titleUnicode: string;
  artist: string;
  artistUnicode: string;
  version: string;
  creator: string;
};

export type Sound = {
  howl: Howl;
  url?: string;
};
export type SoundDictionary = { [key: string]: Sound };

export type Difficulty = {
  keyCount: number;
  od: number;
  hp: number;
};

export const sampleSets = ["default", "normal", "soft", "drum"] as const;
export type SampleSet = (typeof sampleSets)[number];

export type TimingPoint = {
  time: number;
  beatLength: number;
  meter: number;
  sampleSet: SampleSet;
  sampleIndex: number;
  uninherited: boolean;
  volume: number;
  scrollSpeed: number;
};

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
  endTime: number;
  hitSound: HitSound;
  hitSample: HitSample;
};

export type HoldData = {
  type: "hold";
  column: number;
  time: number;
  endTime: number;
};

export type HitWindows = {
  320: number;
  300: number;
  200: number;
  100: number;
  50: number;
  0: number;
};

export interface BeatmapData {
  beatmapId: number;
  beatmapSetId: number;
  version: string;
  timingPoints: TimingPoint[];
  hitObjects: HitObject[];
  breaks: Break[];
  startTime: number;
  endTime: number;
  columnMap?: number[];
  hitWindows: HitWindows;
  song: Required<Sound>;
  backgroundUrl: string | null;
  metadata: Metadata;
  difficulty: Difficulty;
  sounds: SoundDictionary;
}

export const parseOsz = async (
  blob: Blob,
  beatmap: Beatmap,
  replayMods?: EncodedMods,
  replayColumnMap?: number[],
): Promise<BeatmapData> => {
  const zipReader = new ZipReader(new BlobReader(blob));
  const entries = await zipReader.getEntries();

  // Locate .osu file

  const regex = /^\[\d+K\] /; // Removes "[4K] " prefix that the API response sometimes adds
  const diffName = beatmap.version
    .replace(regex, "")
    .replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

  const pattern = new RegExp(`Version:${diffName}(\r|\n)`);

  let osuFileData;
  const osuEntries = entries.filter((entry) => entry.filename.endsWith(".osu"));
  for (const entry of osuEntries) {
    const text = await entry.getData!(new TextWriter());

    if (pattern.test(text)) {
      osuFileData = text;
      break;
    }
  }

  if (!osuFileData) {
    throw new Error(".osu file not found");
  }

  const lines = osuFileData?.split(/\r\n|\n\r|\n/);

  const mods = replayMods
    ? decodeMods(replayMods)
    : useSettingsStore.getState().mods;

  // Parse .osu file sections
  const metadata = parseMetadata(lines);
  const difficulty = parseDifficulty(lines);
  const { hitObjects, delay, startTime, endTime, columnMap } = parseHitObjects(
    lines,
    difficulty.keyCount,
    mods,
    replayColumnMap,
  );
  const timingPoints = parseTimingPoints(
    lines,
    delay,
    startTime,
    endTime,
    mods,
  );

  const breaks = parseBreaks(lines, delay);

  const hitWindows = getHitWindows(difficulty.od, mods);

  // Song file

  const songFilename = getLineValue(lines, "AudioFilename");
  if (!songFilename) {
    throw new Error("Could not find the song filename");
  }

  const songFileExtension = songFilename.split(".").pop();

  if (!songFileExtension) {
    throw new Error("No song file extension");
  }

  let songUrl: string;
  const songFile = findEntry(entries, songFilename);
  if (songFile) {
    const audioBlob = await songFile.getData!(new BlobWriter());

    const delayedAudioBlob = await addDelay(audioBlob, delay / 1000);

    songUrl = URL.createObjectURL(delayedAudioBlob);
  } else {
    // If no audioFile, create a silent audio blob
    // (this is likely a BMS map)
    const audioBlob = await addDelay(null, endTime / 1000 + 2);
    songUrl = URL.createObjectURL(audioBlob);
  }

  const song = {
    howl: new Howl({
      src: [songUrl],
      format: "wav",
      onloaderror: (id, error) => {
        // console.warn(error);
      },
    }),
    url: songUrl,
  };

  // Beatmap sounds

  const sounds: SoundDictionary = {};

  const audioExtensions = ["wav", "mp3", "ogg"];
  const audioEntries = entries.filter((entry) => {
    const extension = entry.filename.split(".").pop()?.toLowerCase();
    return extension && audioExtensions.includes(extension);
  });

  for (const entry of audioEntries) {
    const name = removeFileExtension(entry.filename);

    // Don't load the song file, that's already done
    if (entry.filename === songFilename) {
      continue;
    }

    const fileData = await entry.getData!(new BlobWriter());
    const url = URL.createObjectURL(fileData);

    sounds[name] = {
      url,
      howl: new Howl({
        src: [url],
        format: entry.filename.split(".").pop(),
      }),
    };
  }

  // Background image

  let backgroundUrl = null;

  const backgroundFilename = lines
    .find((line) => line.startsWith("0,0,"))
    ?.split(",")[2]
    .replaceAll('"', "");

  if (backgroundFilename) {
    const backgroundEntry = findEntry(entries, backgroundFilename);

    if (backgroundEntry) {
      const backgroundBlob = await backgroundEntry?.getData!(new BlobWriter());
      backgroundUrl = URL.createObjectURL(backgroundBlob);
    }
  }

  return {
    beatmapSetId: beatmap.beatmapset_id,
    beatmapId: beatmap.id,
    version: beatmap.version,
    timingPoints,
    hitObjects,
    startTime,
    endTime,
    breaks,
    columnMap,
    hitWindows,
    song,
    backgroundUrl,
    metadata,
    difficulty,
    sounds,
  };
};

function findEntry(entries: Entry[], filename: string) {
  const lowercaseFilename = filename.toLowerCase();
  return entries.find(
    (entry) => entry.filename.toLowerCase() === lowercaseFilename,
  );
}

export function parseHitObjects(
  lines: string[],
  columnCount: number,
  mods: Settings["mods"],
  replayColumnMap?: number[],
) {
  const startIndex = lines.indexOf("[HitObjects]") + 1;
  const endIndex = lines.findIndex((line, i) => line === "" && i > startIndex);

  const audioOffset = useSettingsStore.getState().audioOffset;

  // https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29#holds-(osu!mania-only)
  const hitObjects: HitObject[] = [];
  const hitObjectData = lines.slice(startIndex, endIndex);

  // Hit objects may be empty when downloading from SayoBot
  if (hitObjectData.length === 0) {
    throw new Error(
      "Hit object data missing. Try switching beatmap providers and refresh (clear the IndexedDB cache if you have it enabled).",
    );
  }

  hitObjectData.forEach((hitObject: string, i) => {
    const [x, y, time, type, hitSoundDecimal] = hitObject
      .split(",")
      .map((number) => Number(number));

    let column = Math.floor((x * columnCount) / 512);

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
      filename: removeFileExtension(sampleSet[sampleSetStartIndex + 4]),
    };

    hitObjects.push({
      type: "tap",
      column,
      time,
      hitSound,
      hitSample,
      endTime: isHoldNote && !mods.holdOff ? parseInt(sampleSet[0]) : time,
    });

    if (isHoldNote && !mods.holdOff) {
      const endTime = parseInt(sampleSet[0]);

      hitObjects.push({
        type: "hold",
        column,
        time,
        endTime,
      });
    }
  });

  // Remap notes to new columns based on replay or if random/mirror is enabled
  const defaultColumnMap = Array.from({ length: columnCount }, (_, i) => i);
  const columnMap =
    replayColumnMap ??
    (mods.random
      ? shuffle(defaultColumnMap)
      : mods.mirror
        ? defaultColumnMap.toReversed()
        : defaultColumnMap);

  hitObjects.forEach((hitObject) => {
    hitObject.column = columnMap[hitObject.column];
  });

  // Ensure at least 1 second (unaffected by playback rate) before the song starts
  const delay =
    Math.max(1000 - hitObjects[0].time / mods.playbackRate, 0) *
    mods.playbackRate;

  hitObjects.forEach((hitObject) => {
    hitObject.time += delay - audioOffset;
    hitObject.endTime += delay - audioOffset;
  });

  const startTime = hitObjects[0].time;

  const lastHitObjects = hitObjects.slice(-columnCount);

  let endTime = 0;

  lastHitObjects.forEach((hitObject) => {
    const currentEndTime =
      hitObject.type === "hold" ? hitObject.endTime : hitObject.time;

    if (currentEndTime > endTime) {
      endTime = currentEndTime;
    }
  });

  return {
    hitObjects,
    delay,
    startTime,
    endTime,
    columnMap,
  };
}

function parseMetadata(lines: string[]): Metadata {
  const title = getLineValue(lines, "Title");
  const titleUnicode = getLineValue(lines, "TitleUnicode");
  const artist = getLineValue(lines, "Artist");
  const artistUnicode = getLineValue(lines, "ArtistUnicode");
  const version = getLineValue(lines, "Version");
  const creator = getLineValue(lines, "Creator");

  return {
    title,
    titleUnicode,
    artist,
    artistUnicode,
    version,
    creator,
  };
}

function parseDifficulty(lines: string[]): Difficulty {
  const keyCount = Number(getLineValue(lines, "CircleSize"));
  const od = Number(getLineValue(lines, "OverallDifficulty"));
  const hp = Number(getLineValue(lines, "HPDrainRate"));

  return { keyCount, od, hp };
}

function parseBreaks(lines: string[], delay: number): Break[] {
  const startIndex = lines.indexOf("[Events]") + 1;
  const endIndex = lines.findIndex((line, i) => line === "" && i > startIndex);

  const eventLines = lines.slice(startIndex, endIndex);
  const breakLines = eventLines.filter((line) => line.startsWith("2,"));

  return breakLines.map((line) => {
    const [_, startTime, endTime] = line.split(",");

    return {
      startTime: parseInt(startTime) + delay,
      endTime: parseInt(endTime) + delay,
    };
  });
}

function parseTimingPoints(
  lines: string[],
  delay: number,
  startTime: number,
  endTime: number,
  mods: Settings["mods"],
): TimingPoint[] {
  const startIndex = lines.indexOf("[TimingPoints]") + 1;
  const endIndex = lines.findIndex((line, i) => line === "" && i > startIndex);

  const timingPointLines = lines.slice(startIndex, endIndex);

  const settings = useSettingsStore.getState();
  const baseScrollSpeed = settings.scrollSpeed;

  // https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29#timing-points
  const timingPoints: TimingPoint[] = timingPointLines.map((line, i) => {
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

    const timingPoint: TimingPoint = {
      time: i === 0 ? 0 : time + delay,
      beatLength,
      meter,
      sampleSet: sampleSets[sampleSet],
      sampleIndex,
      uninherited: !!uninherited,
      volume: volume / 100,
      scrollSpeed: baseScrollSpeed,
    };

    return timingPoint;
  });

  if (!mods.constantSpeed) {
    const mostCommonBeatLength = getMostCommonBeatLength(
      timingPoints.filter((timingPoint) => timingPoint.uninherited),
      startTime,
      endTime,
    );

    let lastUninheritedTimingPoint: TimingPoint | undefined;
    timingPoints.forEach((timingPoint: TimingPoint) => {
      if (timingPoint.uninherited) {
        // Set uninherited timing point scroll speeds proportional to the most common beatLength
        // e.g. If beatLength is half of the most common beatLength then BPM = 2 * most common BPM, so double scroll speed
        timingPoint.scrollSpeed =
          baseScrollSpeed * (mostCommonBeatLength / timingPoint.beatLength);

        lastUninheritedTimingPoint = timingPoint;
      } else {
        // The beatLength of inherited timing points indicate their scrollSpeed relative to the last uninherited timing point
        // e.g. If beatLength is -50, scrollSpeed is double the last uninherited timing point's scroll speed
        timingPoint.scrollSpeed =
          (lastUninheritedTimingPoint?.scrollSpeed ?? baseScrollSpeed) *
          (100 / -timingPoint.beatLength);
      }
    });
  }

  return timingPoints;
}

function getMostCommonBeatLength(
  uninheritedTimingPoints: TimingPoint[],
  startTime: number,
  endTime: number,
) {
  const beatLengthDurations = new Map<number, number>();

  for (let i = 0; i < uninheritedTimingPoints.length; i++) {
    const current = uninheritedTimingPoints[i];
    const next = uninheritedTimingPoints[i + 1];

    const intervalStart = Math.max(current.time, startTime);
    const intervalEnd = next ? Math.min(next.time, endTime) : endTime;

    const duration = intervalEnd - intervalStart;

    beatLengthDurations.set(
      current.beatLength,
      (beatLengthDurations.get(current.beatLength) || 0) + duration,
    );
  }

  let mostCommonBeatLength = 0;
  let maxDuration = 0;

  beatLengthDurations.forEach((duration, beatLength) => {
    if (duration > maxDuration) {
      mostCommonBeatLength = beatLength;
      maxDuration = duration;
    }
  });

  return mostCommonBeatLength;
}

function getLineValue(lines: string[], key: string) {
  const line = lines.find((line) => line.startsWith(`${key}:`));

  if (!line) {
    throw new Error(`No lines found with key: ${key}`);
  }

  const value = line.split(`${key}:`)[1].trim();
  return value;
}

// https://osu.ppy.sh/wiki/en/Gameplay/Judgement/osu%21mania#scorev2
// Table: https://i.ppy.sh/d0319d39fbc14fb6e380264e78d1e2c839c6912c/68747470733a2f2f646c2e64726f70626f7875736572636f6e74656e742e636f6d2f732f6d757837616176393779386c7639302f6f73756d616e69612532424f442e706e67
function getHitWindows(od: number, mods: Settings["mods"]): HitWindows {
  if (mods.easy) {
    od = od / 2;
  } else if (mods.hardRock) {
    od = Math.min(od * 1.4, 10);
  }

  return {
    320: od <= 5 ? 22.4 - 0.6 * od : 24.9 - 1.1 * od,
    300: 64 - 3 * od,
    200: 97 - 3 * od,
    100: 127 - 3 * od,
    50: 151 - 3 * od,
    0: 188 - 3 * od,
  };
}

export async function getBeatmapSetIdFromOsz(blob: Blob) {
  const zipReader = new ZipReader(new BlobReader(blob));
  const entries = await zipReader.getEntries();

  // Locate any .osu file
  const osuEntry = entries.find((entry) => entry.filename.endsWith(".osu"));

  if (!osuEntry) {
    throw new Error("No .osu files found.");
  }

  const text = await osuEntry.getData!(new TextWriter());
  const lines = text?.split(/\r\n|\n\r|\n/);

  const beatmapSetId = getLineValue(lines, "BeatmapSetID");

  return beatmapSetId;
}
