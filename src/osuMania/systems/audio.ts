import { SampleSet, SoundDictionary } from "@/lib/beatmapParser";
import { BASE_PATH } from "@/lib/utils";
import { Howl } from "howler";
import { Game } from "../game";
import { Tap } from "../sprites/tap/tap";

export class AudioSystem {
  public game: Game;
  public sounds: SoundDictionary;
  public beatmapSounds: SoundDictionary;
  public playedSounds = new Set<Howl>();

  constructor(game: Game, sounds: SoundDictionary) {
    this.game = game;
    this.sounds = sounds;

    // Skin hitsounds will start with "skin-"
    ["normal", "soft", "drum"].forEach((sampleSet) => {
      ["normal", "whistle", "finish", "clap"].forEach((sound) => {
        this.load(
          `skin-${sampleSet}-hit${sound}`,
          `${BASE_PATH}/skin/${sampleSet}-hit${sound}.ogg`,
        );
      });
    });
  }

  public dispose() {}

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
    const nextTapNote = this.game.columns[columnId].find(
      (hitObject): hitObject is Tap => hitObject.data.type === "tap",
    );

    nextTapNote?.playHitsounds();
  }
}
