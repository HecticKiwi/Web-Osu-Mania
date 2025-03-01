import { Howl } from "howler";
import JSZip from "jszip";
import { addDelay } from "./audio";
import { Beatmap } from "./osuApi";
import { getSettings, removeFileExtension, shuffle } from "./utils";

export type HitObject = TapData | HoldData;

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
  timingPoints: TimingPoint[];
  hitObjects: HitObject[];
  startTime: number;
  endTime: number;
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
): Promise<BeatmapData> => {
  const zip = await JSZip.loadAsync(blob);

  // Locate .osu file
  const osuFiles = Object.keys(zip.files).filter((filename) =>
    filename.endsWith(".osu"),
  );

  const regex = /^\[\d+K\] /; // Removes "[4K] " prefix that the API response sometimes adds
  const diffName = beatmap.version
    .replace(regex, "")
    .replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

  const pattern = new RegExp(`Version:${diffName}(\r|\n)`);

  let osuFileData;
  for (const file of osuFiles) {
    const fileData = await zip.files[file].async("text");

    if (pattern.test(fileData)) {
      osuFileData = fileData;
      break;
    }
  }

  if (!osuFileData) {
    throw new Error(".osu file not found");
  }

  const lines = osuFileData?.split(/\r\n|\n\r|\n/);

  // Parse .osu file sections
  const metadata = parseMetadata(lines);
  const difficulty = parseDifficulty(lines);
  const { hitObjects, delay, startTime, endTime } = parseHitObjects(
    lines,
    difficulty.keyCount,
  );
  const timingPoints = parseTimingPoints(lines, delay, startTime, endTime);

  const hitWindows = getHitWindows(difficulty.od);

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
  const songFile = findFile(zip, songFilename);
  if (songFile) {
    const audioBlob = await songFile.async("blob");

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
  const audioFiles = Object.keys(zip.files).filter((fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension && audioExtensions.includes(extension);
  });

  for (const fileName of audioFiles) {
    const name = removeFileExtension(fileName);

    // Don't load the song file, that's already done
    if (fileName === songFilename) {
      continue;
    }

    const fileData = await zip.files[fileName].async("blob");
    const url = URL.createObjectURL(fileData);

    sounds[name] = {
      url,
      howl: new Howl({
        src: [url],
        format: fileName.split(".").pop(),
        // onloaderror: (_, e) => console.warn(e),
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
    const backgroundFile = findFile(zip, backgroundFilename);

    const backgroundBlob = await backgroundFile.async("blob");
    backgroundUrl = URL.createObjectURL(backgroundBlob);
  }

  return {
    timingPoints,
    hitObjects,
    startTime,
    endTime,
    hitWindows,
    song,
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

  const { audioOffset, mods } = getSettings();

  // https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29#holds-(osu!mania-only)
  const hitObjects: HitObject[] = [];
  const hitObjectData = lines.slice(startIndex, endIndex);
  hitObjectData.forEach((hitObject: string, i) => {
    const [x, y, time, type, hitSoundDecimal] = hitObject
      .split(",")
      .map((number) => Number(number));

    let column = Math.floor((x * columnCount) / 512);
    if (mods.mirror) {
      column = columnCount - column - 1;
    }

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

  if (mods.random) {
    const columns = Array.from({ length: columnCount }, (_, i) => i);
    const shuffledColumns = shuffle(columns);

    hitObjects.forEach((hitObject) => {
      hitObject.column = shuffledColumns[hitObject.column];
    });
  }

  // Ensure at least 1 second (unaffected by playback rate) before the song starts
  const delay =
    Math.max(1000 - hitObjects[0].time / mods.playbackRate, 0) *
    mods.playbackRate;
  hitObjects.forEach((hitObject) => {
    hitObject.time += delay - audioOffset;
    if (hitObject.type === "hold") {
      hitObject.endTime += delay - audioOffset;
    }
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
  };
}

export function parseMetadata(lines: string[]): Metadata {
  const title = getLineValue(lines, "Title");
  const titleUnicode = getLineValue(lines, "TitleUnicode");
  const artist = getLineValue(lines, "Artist");
  const artistUnicode = getLineValue(lines, "ArtistUnicode");
  const version = getLineValue(lines, "Version");
  const creator = getLineValue(lines, "Creator");

  return { title, titleUnicode, artist, artistUnicode, version, creator };
}

export function parseDifficulty(lines: string[]): Difficulty {
  const keyCount = Number(getLineValue(lines, "CircleSize"));
  const od = Number(getLineValue(lines, "OverallDifficulty"));

  return { keyCount, od };
}

export function parseTimingPoints(
  lines: string[],
  delay: number,
  startTime: number,
  endTime: number,
): TimingPoint[] {
  const startIndex = lines.indexOf("[TimingPoints]") + 1;
  const endIndex = lines.findIndex((line, i) => line === "" && i > startIndex);

  const timingPointLines = lines.slice(startIndex, endIndex);

  const settings = getSettings();
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

  if (!settings.mods.constantSpeed) {
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

// https://osu.ppy.sh/wiki/en/Beatmap/Overall_difficulty#osu!mania
// Table: https://i.ppy.sh/d0319d39fbc14fb6e380264e78d1e2c839c6912c/68747470733a2f2f646c2e64726f70626f7875736572636f6e74656e742e636f6d2f732f6d757837616176393779386c7639302f6f73756d616e69612532424f442e706e67
export function getHitWindows(od: number): HitWindows {
  const { mods } = getSettings();

  if (mods.easy) {
    od = od / 2;
  } else if (mods.hardRock) {
    od = Math.min(od * 1.4, 10);
  }

  return {
    320: 16,
    300: 64 - 3 * od,
    200: 97 - 3 * od,
    100: 127 - 3 * od,
    50: 151 - 3 * od,
    0: 188 - 3 * od,
  };
}

export async function getBeatmapSetIdFromOsz(blob: Blob) {
  const zip = await JSZip.loadAsync(blob);

  // Locate any .osu file
  const osuFile = Object.keys(zip.files).find((filename) =>
    filename.endsWith(".osu"),
  );

  if (!osuFile) {
    throw new Error("No .osu files found.");
  }

  const fileData = await zip.files[osuFile].async("text");
  const lines = fileData?.split(/\r\n|\n\r|\n/);

  const beatmapSetId = getLineValue(lines, "BeatmapSetID");

  return beatmapSetId;
}
