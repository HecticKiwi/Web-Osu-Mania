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

export async function importBackupOld(blob: Blob) {
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
