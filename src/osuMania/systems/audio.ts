import { CUSTOM_SOUND_OPTION } from "@/components/settings/sounds/customSoundSelect";
import type { SampleSet, SoundDictionary } from "@/lib/beatmapParser";
import { idb } from "@/lib/idb";
import { hitsoundSampleSets, hitsoundSamples } from "@/lib/skinParser";
import { BASE_PATH, createObjectURLWithExtension } from "@/lib/utils";
import { Howl } from "howler";
import type { Game } from "../game";
import type { Tap } from "../sprites/tap/tap";

export class AudioSystem {
  public game: Game;
  public sounds: SoundDictionary;
  public beatmapSounds: SoundDictionary;
  public playedSounds = new Set<Howl>();

  private customHitsoundUrls: string[] = [];

  constructor(game: Game, sounds: SoundDictionary) {
    this.game = game;
    this.sounds = sounds;
  }

  public dispose() {
    this.customHitsoundUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  }

  public async loadHitsounds() {
    const tasks: Promise<void>[] = [];

    const soundPairs = hitsoundSampleSets.flatMap((sampleSet) =>
      hitsoundSamples.map((sample) => ({ sampleSet, sample })),
    );

    tasks.push(
      ...soundPairs.map(async ({ sampleSet, sample }) => {
        // Skin hitsounds will start with "skin-"
        const key = `skin-${sampleSet}-hit${sample}`;

        const soundName = `${sampleSet}-${sample}` as const;
        const sound = this.game.settings.skin.sounds[soundName];
        if (sound === CUSTOM_SOUND_OPTION) {
          const customSound = await idb.getCustomSound(soundName);
          if (!customSound) {
            throw new Error(
              `Custom ${sampleSet} ${sample} hitsound could not be loaded.`,
            );
          }

          const url = createObjectURLWithExtension(customSound.file as File);
          this.customHitsoundUrls.push(url);

          this.load(key, url);
        } else if (sound) {
          const url = `${BASE_PATH}/skin/sounds/hitsounds/${sound}`;
          this.load(key, url);
        }
      }),
    );

    await Promise.all(tasks);
  }

  private load(name: string, src: string) {
    this.sounds[name] = {
      howl: new Howl({
        src: [src],
        preload: true,
        onloaderror: (_, e) => {
          // console.warn(e, src);
        },
      }),
    };
  }

  public play(filename: string, volume?: number) {
    if (this.game.settings.performanceMode) {
      return;
    }

    const sound = this.sounds[filename];

    if (!sound) {
      return;
    }

    if (volume !== undefined) {
      sound.howl.volume(volume);
    } else {
      sound.howl.volume(1);
    }

    // Play the sound at most once per frame to avoid erratic volumes / clipping
    if (!this.playedSounds.has(sound.howl)) {
      sound.howl.play();
      this.playedSounds.add(sound.howl);
    }
  }

  public playHitSound(
    sampleSet: SampleSet,
    sampleIndex: number,
    name: "normal" | "whistle" | "clap" | "finish",
    volume: number,
  ) {
    const prefix = `${sampleSet}-hit`;
    const suffix = `${sampleIndex > 1 ? sampleIndex : ""}`;
    const sound = `${prefix}${name}${suffix}`;

    if (
      !this.game.settings.ignoreBeatmapHitsounds &&
      sampleIndex > 0 &&
      this.sounds[`${sound}`]
    ) {
      this.play(
        `${prefix}${name}${suffix}`,
        this.game.settings.sfxVolume * volume,
      );
    } else {
      this.play(`skin-${prefix}${name}`, this.game.settings.sfxVolume * volume);
    }
  }

  public playNextHitsounds(columnId: number) {
    for (
      let i = this.game.currentColumnIndices[columnId];
      i < this.game.columns[columnId].length;
      i++
    ) {
      const hitObject = this.game.columns[columnId][i];

      if (hitObject.data.type === "tap") {
        (hitObject as Tap).playHitsounds();
        return;
      }
    }
  }
}
