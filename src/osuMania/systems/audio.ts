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
    this.sounds[name] = new Howl({
      src: [src],
      // src: ["/skin/normal-hitnormal.ogg"],
      // format: "ogg",
      preload: true,
      onloaderror: (_, e) => {
        // console.warn(e, src);
      },
    });
  }

  public play(filename: string, volume?: number) {
    const sound = this.sounds[filename];

    if (!sound) {
      console.warn("Sound not found: ", filename);

      return;
    }

    if (volume) {
      sound.volume(volume);
    } else {
      sound.volume(1);
    }

    // Play the sound at most once per frame to avoid erratic volumes / clipping
    if (!this.playedSounds.has(sound)) {
      sound.play();
      this.playedSounds.add(sound);
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

    if (sampleIndex > 0 && this.sounds[`${sound}.wav`]) {
      this.play(
        `${prefix}${name}${suffix}.wav`,
        this.game.settings.sfxVolume * volume,
      );
    } else {
      this.play(`skin-${prefix}${name}`, this.game.settings.sfxVolume * volume);
    }

    this.game.settings.sfxVolume;
  }

  public dispose() {
    Howler.unload();
  }
}
