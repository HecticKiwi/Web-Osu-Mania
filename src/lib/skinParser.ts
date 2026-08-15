import { CUSTOM_SOUND_OPTION } from "@/components/settings/sounds/customSoundSelect";
import type { Settings } from "@/stores/settingsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { Entry, FileEntry } from "@zip.js/zip.js";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";
import { idb } from "./idb";

export const hitsoundSampleSets = ["normal", "soft", "drum"] as const;
export const hitsoundSamples = ["normal", "whistle", "finish", "clap"] as const;

export async function parseOskSounds(blob: Blob) {
  const zipReader = new ZipReader(new BlobReader(blob));
  const entries = await zipReader.getEntries();

  const tasks: Promise<void>[] = [];

  tasks.push(processSound("applause", "applause", entries));
  tasks.push(processSound("fail", "failsound", entries));

  const soundPairs = hitsoundSampleSets.flatMap((sampleSet) =>
    hitsoundSamples.map((sample) => ({ sampleSet, sample })),
  );

  tasks.push(
    ...soundPairs.map(async ({ sampleSet, sample }) => {
      const soundName = `${sampleSet}-${sample}` as const;
      const fileName = `${sampleSet}-hit${sample}`;
      await processSound(soundName, fileName, entries);
    }),
  );

  await Promise.all(tasks);
  await zipReader.close();
}

async function processSound(
  soundName: keyof Settings["skin"]["sounds"],
  fileName: string,
  entries: Entry[],
) {
  const matchingEntry = entries.find(
    (entry) =>
      !entry.directory &&
      entry.filename.toLowerCase().match(`${fileName}\\.(mp3|wav|ogg)$`),
  ) as FileEntry | undefined;

  if (matchingEntry) {
    const audioBlob = await matchingEntry.getData(new BlobWriter());

    const audioFile = new File([audioBlob], matchingEntry.filename, {
      type: audioBlob.type,
    });

    await idb.saveCustomSound(soundName, audioFile);
  }
  useSettingsStore.setState((draft) => {
    draft.skin.sounds[soundName] = matchingEntry ? CUSTOM_SOUND_OPTION : null;
  });
}
