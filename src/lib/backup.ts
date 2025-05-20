import { ExportOptionId } from "@/components/settings/backupSettings";
import { idb } from "@/lib/idb";
import { useBeatmapSetCacheStore } from "@/stores/beatmapSetCacheStore";
import { useHighScoresStore } from "@/stores/highScoresStore";
import { useSavedBeatmapSetsStore } from "@/stores/savedBeatmapSetsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStoredBeatmapSetsStore } from "@/stores/storedBeatmapSetsStore";

type SerializedIdbFile = {
  file: string;
  dateAdded: number;
};

type ExportData = {
  localStorage: Partial<Record<ExportOptionId, any>>;
  beatmapFiles: { key: string; value: SerializedIdbFile }[];
  replayData: { key: string; value: SerializedIdbFile }[];
};

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64: string): Blob {
  const [meta, content] = base64.split(",");
  const mime = meta.match(/:(.*?);/)?.[1] || "application/octet-stream";
  const byteCharacters = atob(content);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

export async function exportBackup(selectedData: ExportOptionId[]) {
  const exportData: ExportData = {
    localStorage: {},
    replayData: [],
    beatmapFiles: [],
  };

  if (selectedData.includes("settingsAndKeybinds")) {
    const mods = useSettingsStore.getState().mods;
    useSettingsStore.getState().resetMods();

    exportData.localStorage["settingsAndKeybinds"] =
      localStorage.getItem("settings");

    useSettingsStore.setState({ mods });
  }

  if (selectedData.includes("highScoresAndReplays")) {
    exportData.localStorage["highScoresAndReplays"] =
      localStorage.getItem("highScores");

    const replayEntries = await idb.getAllStoreEntries("replayFiles");

    exportData.replayData = await Promise.all(
      replayEntries.map(async (entry) => ({
        key: entry.key,
        value: {
          file: await blobToBase64(entry.value.file),
          dateAdded: entry.value.dateAdded,
        },
      })),
    );
  }

  if (selectedData.includes("savedBeatmapSets")) {
    exportData.localStorage["savedBeatmapSets"] =
      localStorage.getItem("savedBeatmapSets");
  }

  if (selectedData.includes("storedBeatmapSets")) {
    exportData.localStorage["storedBeatmapSets"] =
      localStorage.getItem("storedBeatmapSets");

    const beatmapFileEntries = await idb.getAllStoreEntries("beatmapFiles");
    exportData.beatmapFiles = await Promise.all(
      beatmapFileEntries.map(async (entry) => ({
        key: entry.key,
        value: {
          file: await blobToBase64(entry.value.file),
          dateAdded: entry.value.dateAdded,
        },
      })),
    );
  }

  const json = JSON.stringify(exportData);
  const blob = new Blob([json], { type: "application/json" });

  return blob;
}

export async function importBackup(blob: Blob) {
  const json = await blob.text();
  const data: ExportData = JSON.parse(json);

  if (data.localStorage.settingsAndKeybinds) {
    const mods = useSettingsStore.getState().mods;
    localStorage.setItem("settings", data.localStorage.settingsAndKeybinds);

    useSettingsStore.persist.rehydrate();
    useSettingsStore.setState({ mods });
  }

  if (data.localStorage.highScoresAndReplays) {
    localStorage.setItem("highScores", data.localStorage.highScoresAndReplays);

    useHighScoresStore.persist.rehydrate();
  }

  if (data.localStorage.savedBeatmapSets) {
    localStorage.setItem(
      "savedBeatmapSets",
      data.localStorage.savedBeatmapSets,
    );

    useSavedBeatmapSetsStore.persist.rehydrate();
  }

  if (data.localStorage.storedBeatmapSets) {
    localStorage.setItem(
      "storedBeatmapSets",
      data.localStorage.storedBeatmapSets,
    );

    useStoredBeatmapSetsStore.persist.rehydrate();
  }

  await idb.clearReplays();
  for (const entry of data.replayData) {
    const file = base64ToBlob(entry.value.file);
    await idb.saveToStore(
      "replayFiles",
      file,
      entry.key,
      entry.value.dateAdded,
    );
  }

  await idb.clearBeatmapSets();
  for (const entry of data.beatmapFiles) {
    const file = base64ToBlob(entry.value.file);
    await idb.saveToStore(
      "beatmapFiles",
      file,
      entry.key,
      entry.value.dateAdded,
    );
  }

  await useBeatmapSetCacheStore.getState().calculateCacheUsage();
}
