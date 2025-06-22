import { ExportOptionId } from "@/components/settings/backupSettings";
import { idb, StoreName } from "@/lib/idb";
import { useHighScoresStore } from "@/stores/highScoresStore";
import { useSavedBeatmapSetsStore } from "@/stores/savedBeatmapSetsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStoredBeatmapSetsStore } from "@/stores/storedBeatmapSetsStore";
import {
  BlobReader,
  BlobWriter,
  TextReader,
  ZipReader,
  ZipWriter,
} from "@zip.js/zip.js";
import { createElement } from "react";
import { toast } from "sonner";

export async function downloadBackup(
  filename: string,
  selectedData: ExportOptionId[],
) {
  const { default: streamSaver } = await import("streamsaver");

  const fileStream = streamSaver.createWriteStream(filename);
  const zipWriter = new ZipWriter(fileStream);

  // Localstorage

  if (selectedData.includes("settingsAndKeybinds")) {
    const mods = useSettingsStore.getState().mods;
    useSettingsStore.getState().resetMods();
    addLocalStorageFileToZip(zipWriter, "settings");
    useSettingsStore.setState({ mods });
  }

  if (selectedData.includes("highScoresAndReplays")) {
    addLocalStorageFileToZip(zipWriter, "highScores");
  }

  if (selectedData.includes("savedBeatmapSets")) {
    addLocalStorageFileToZip(zipWriter, "savedBeatmapSets");
  }

  if (selectedData.includes("storedBeatmapSets")) {
    addLocalStorageFileToZip(zipWriter, "storedBeatmapSets");
  }

  // IndexedDB

  if (selectedData.includes("storedBeatmapSets")) {
    const getFilename = (key: string) => {
      const beatmapSet = useStoredBeatmapSetsStore
        .getState()
        .storedBeatmapSets.find((set) => set.id.toString() === key);

      if (beatmapSet) {
        const unsafeCharacters = /[<>:"/\\|?*\[\]()]/g;
        return `${key} ${beatmapSet.artist.replace(unsafeCharacters, "_")} - ${beatmapSet.title.replace(unsafeCharacters, "_")}.osz`;
      } else {
        return `${key}.osz`;
      }
    };

    await addIdbStoreToZip(zipWriter, "beatmapFiles", getFilename, false);
  }

  if (selectedData.includes("highScoresAndReplays")) {
    const getFilename = (key: string) => {
      return `${key}.womr`;
    };

    await addIdbStoreToZip(zipWriter, "replayFiles", getFilename);
  }

  await zipWriter.close();
}

function addLocalStorageFileToZip(
  zipWriter: ZipWriter<unknown>,
  localStorageKey: string,
) {
  const data = localStorage.getItem(localStorageKey);

  if (!data) {
    return;
  }

  zipWriter.add(`${localStorageKey}.json`, new TextReader(data));
}

async function addIdbStoreToZip(
  zipWriter: ZipWriter<unknown>,
  storeName: StoreName,
  getFilename: (key: string) => string,
  deflate = true,
) {
  const keys = await idb.getStoreKeys(storeName);

  for (const key of keys) {
    const value = await idb.getStoreValue(storeName, key);

    if (!value) {
      continue;
    }

    const blob = value.file;
    const path = `${storeName}/${getFilename(key)}`;

    await zipWriter.add(path, new BlobReader(blob), {
      level: deflate ? 6 : 0,
    });
  }
}

export async function importBackup(zipBlob: File) {
  const reader = new ZipReader(new BlobReader(zipBlob));
  const entries = await reader.getEntries();

  let hasSettings = false;
  let hasHighScores = false;
  let savedBeatmapCount: number | null = null;
  let storedBeatmapCount: number | null = null;

  for (const entry of entries) {
    if (entry.directory) {
      continue;
    }

    const blob = await entry.getData?.(new BlobWriter());
    if (!blob) {
      continue;
    }

    const filename = entry.filename;

    // Localstorage
    if (filename.endsWith(".json") && !filename.includes("/")) {
      const key = filename.replace(".json", "");
      const text = await blob.text();
      localStorage.setItem(key, text);

      if (filename === "settings.json") {
        const mods = useSettingsStore.getState().mods;
        useSettingsStore.persist.rehydrate();
        hasSettings = true;
        useSettingsStore.setState({ mods });
      } else if (filename === "highScores.json") {
        useHighScoresStore.persist.rehydrate();
        hasHighScores = true;
      } else if (filename === "savedBeatmapSets.json") {
        useSavedBeatmapSetsStore.persist.rehydrate();
        savedBeatmapCount =
          useSavedBeatmapSetsStore.getState().savedBeatmapSets.length;
      } else if (filename === "storedBeatmapSets.json") {
        useStoredBeatmapSetsStore.persist.rehydrate();
        storedBeatmapCount =
          useStoredBeatmapSetsStore.getState().storedBeatmapSets.length;
      }

      continue;
    }

    // Beatmap files
    const beatmapMatch = filename.match(/^beatmapFiles\/(\d+)(?: .+)?\.osz$/);
    if (beatmapMatch) {
      const key = beatmapMatch[1];
      await idb.saveToStore("beatmapFiles", blob, key, Date.now());
      storedBeatmapCount ??= 0;
      storedBeatmapCount++;

      continue;
    }

    // Replay files
    const replayMatch = filename.match(/^replayFiles\/(\d+)(?: .+)?\.womr$/);
    if (replayMatch) {
      const key = replayMatch[1];
      await idb.saveToStore("replayFiles", blob, key, Date.now());
      continue;
    }
  }

  if (
    hasSettings ||
    hasHighScores ||
    savedBeatmapCount !== null ||
    storedBeatmapCount !== null
  ) {
    toast("Backup imported successfully", {
      description: createElement("ul", { className: "list-inside list-disc" }, [
        ...(hasSettings
          ? [createElement("li", {}, "Settings & Keybinds")]
          : []),
        ...(hasHighScores
          ? [createElement("li", {}, "Highscores & Replays")]
          : []),
        ...(savedBeatmapCount !== null
          ? [
              createElement(
                "li",
                {},
                `${savedBeatmapCount} Saved Beatmap${savedBeatmapCount > 1 ? "s" : ""}`,
              ),
            ]
          : []),
        ...(storedBeatmapCount !== null
          ? [
              createElement(
                "li",
                {},
                `${storedBeatmapCount} Saved Beatmap${storedBeatmapCount > 1 ? "s" : ""}`,
              ),
            ]
          : []),
      ]),
      duration: 8000,
    });
  } else {
    toast("Backup did not contain any data", {
      description: "Please check that the ZIP contains valid backup data.",
    });
  }

  await reader.close();
}
