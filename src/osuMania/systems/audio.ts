import { SampleSet, Sounds } from "@/lib/beatmapParser";
import { Howl, Howler } from "howler";
import { Game } from "../game";

export class AudioSystem {
  public game: Game;
  public sounds: Sounds;
  public beatmapSounds: Sounds;
  public playedSounds = new Set<Howl>();

  constructor(game: Game, sounds: Sounds) {
    this.game = game;
    this.sounds = sounds;

    // Skin hitsounds will start with "skin-"
    ["normal", "soft", "drum"].forEach((sampleSet) => {
      ["normal", "whistle", "finish", "clap"].forEach((sound) => {
        this.load(
          `skin-${sampleSet}-hit${sound}`,
          `/skin/${sampleSet}-hit${sound}.ogg`,
        );
      });
    });
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
    const sound = this.sounds[filename];

    if (!sound) {
      console.warn("Sound not found: ", filename);

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

  public dispose() {
    Howler.unload();
  }
}
