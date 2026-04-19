import { createSelectors, getLocalStorageConfig } from "@/lib/zustand";
import { getAllLaneColors } from "@/osuMania/constants";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const BEATMAP_API_PROVIDERS = {
  "Mino (catboy.best)": "https://catboy.best/d/$setId",
  NeriNyan: "https://api.nerinyan.moe/d/$setId",
  SayoBot: "https://dl.sayobot.cn/beatmaps/download/$setId",
  "osu.direct": "https://osu.direct/api/d/$setId",
  Nekoha: "https://mirror.nekoha.moe/api4/download/$setId",
} as const;

export type BeatmapProvider = keyof typeof BEATMAP_API_PROVIDERS | "Custom";

export const AUDIO_PREVIEW_PROVIDERS = {
  "Official osu!": "https://b.ppy.sh/preview/$setId.mp3",
  Beatconnect: "https://beatconnect.io/preview/$setId.mp3",
  SayoBot: "https://cdnx.sayobot.cn:25225/preview/$setId.mp3",
} as const;

export type AudioPreviewProvider =
  | keyof typeof AUDIO_PREVIEW_PROVIDERS
  | "Custom";

export const BEATMAP_COVER_PROVIDERS = {
  "Official osu!": "https://assets.ppy.sh/beatmaps/$setId/covers/cover.jpg",
  SayoBot: "https://a.sayobot.cn/beatmaps/$setId/covers/cover.webp",
} as const;

export type BeatmapCoverProvider =
  | keyof typeof BEATMAP_COVER_PROVIDERS
  | "Custom";

export const SKIN_STYLES = ["bars", "circles", "arrows", "diamonds"] as const;
export type SkinStyle = (typeof SKIN_STYLES)[number];

export const SKIN_STYLE_ICONS: Record<SkinStyle, string> = {
  bars: "▬",
  circles: "⬤",
  arrows: "↗",
  diamonds: "◆",
};

export const JUDGEMENT_SET_OPTIONS: {
  id: string;
  label: string;
  scale: number;
  creator: string;
  url: string;
}[] = [
  {
    id: "azureSnowfall",
    label: "Azure Snowfall",
    scale: 1,
    creator: "thetasigma's skin",
    url: "https://osu.ppy.sh/community/forums/topics/1498492?n=1",
  },
  {
    id: "chocolate",
    label: "105°C Chocolate",
    scale: 1,
    creator: "Tkieen's skin",
    url: "https://osu.ppy.sh/community/forums/topics/1496067",
  },
  {
    id: "bangDream",
    label: "BanG Dream!",
    scale: 0.6,
    creator: "Hello_Real's skin",
    url: "https://www.curseforge.com/osugame/skins/reys-skin-accuracy",
  },
  {
    id: "fnf",
    label: "Friday Night Funkin'",
    scale: 0.45,
    creator: "Saltssaumure's skin",
    url: "https://skins.osuck.net/skins/2058",
  },
  {
    id: "osuStable",
    label: "osu!(stable)",
    scale: 0.35,
    creator: "the official osu! assets",
    url: "https://github.com/ppy/osu-resources/tree/master/osu.Game.Resources/Skins/Legacy",
  },
] as const;
export type JudgementSetId = (typeof JUDGEMENT_SET_OPTIONS)[number]["id"];

export const EARLY_LATE_THRESHOLDS = [-1, 200, 300, 320] as const;
export type EarlyLateThreshold = (typeof EARLY_LATE_THRESHOLDS)[number];

export const earlyLateThresholdOptions: {
  id: EarlyLateThreshold;
  label: string;
}[] = [
  { id: -1, label: "Off" },
  { id: 200, label: "200s and below" },
  { id: 300, label: "300s and below" },
  { id: 320, label: "Always" },
] as const;

export const touchModes = ["normal", "fullscreen"] as const;
export type TouchMode = (typeof touchModes)[number];

export const COVER_TYPES = ["fadeIn", "fadeOut"] as const;
export type CoverType = (typeof COVER_TYPES)[number];

export const COVER_TYPE_LABELS: Record<CoverType, string> = {
  fadeIn: "Fade In",
  fadeOut: "Fade Out",
};

export type ColumnColor = {
  tap: string;
  holdHead: string;
  hold: string;
};

export type JudgementCounterPosition = "left" | "right";
export const judgementCounterOptions: {
  id: JudgementCounterPosition | null;
  label: string;
}[] = [
  { id: null, label: "Off" },
  { id: "left", label: "Left Side" },
  { id: "right", label: "Right Side" },
] as const;

export type ProgressDisplay = "bar" | "pie";
export const progressDisplayOptions: {
  id: ProgressDisplay | null;
  label: string;
}[] = [
  { id: null, label: "Off" },
  { id: "bar", label: "Bar" },
  { id: "pie", label: "Pie" },
] as const;

export type Settings = {
  version: number;
  volume: number;
  musicVolume: number;
  sfxVolume: number;
  scrollSpeed: number;
  backgroundDim: number;
  backgroundBlur: number;
  backgroundVideo: {
    // There may be more options to convert FLV and AVI later
    enabled: boolean;
  };
  show300g: boolean;
  showErrorBar: boolean;
  audioOffset: number;
  showFpsCounter: boolean;
  storeDownloadedBeatmaps: boolean;
  upscroll: boolean;
  darkerHoldNotes: boolean;
  hitPositionOffset: number;
  noteOffset: number;
  noteScale: number;
  beatmapProvider: BeatmapProvider;
  customBeatmapProvider: string;
  audioPreviewProvider: AudioPreviewProvider;
  customAudioPreviewProvider: string;
  beatmapCoverProvider: BeatmapCoverProvider;
  customBeatmapCoverProvider: string;
  proxyBeatmapDownloads: boolean;
  ignoreBeatmapHitsounds: boolean;
  style: SkinStyle;
  errorBarScale: number;
  preferMetadataInOriginalLanguage: boolean;
  unpauseDelay: number;
  hideBeatmapSetCovers: boolean;
  retryOnFail: boolean;
  performanceMode: boolean;
  hue: number;
  stagePosition: number;
  stageOpacity: number;
  stageSidesOpacity: number;
  laneWidthAdjustment: number;
  laneSpacing: number;
  touch: {
    enabled: boolean;
    mode: TouchMode;
    borderOpacity: number;
  };
  keybinds: {
    // Index 0: key count
    // Index 1: column index
    // Index 2: [first keybind, second keybind] for column
    keyModes: [string | null, string | null][][];
    pause: string | null;
    retry: string | null;
    toggleHud: string | null;
  };
  /**
   * When adding mods, don't forget to
   * 1. Add the mod strings to getModStrings()
   * 2. Make necessary changes to replay.ts and utils.ts so the mod is stored in replays properly
   */
  mods: {
    autoplay: boolean;
    easy: boolean;
    playbackRate: number;
    hardRock: boolean;
    mirror: boolean;
    random: boolean;
    constantSpeed: boolean;
    holdOff: boolean;
    noFail: boolean;
    suddenDeath: boolean;
    perfect: boolean;
    perfectSs: boolean;
    hpOverride: number | null;
    odOverride: number | null;
    cover: {
      amount: number;
      type: CoverType;
    } | null;
    percy: {
      cutoffDuration: number;
      fadeDuration: number; // Currently not implemented
    } | null;
  };
  ui: {
    showScore: boolean;
    showCombo: boolean;
    showAccuracy: boolean;
    showJudgement: boolean;
    earlyLateThreshold: EarlyLateThreshold;
    showProgressBar?: boolean; // Old, replaced by progressDisplay
    showHealthBar: boolean;
    receptorOpacity: number;
    judgementCounter: JudgementCounterPosition | null;
    progressDisplay: ProgressDisplay | null;
    stageHudYPosition: number;
  };
  skin: {
    colors: {
      mode: "simple" | "custom";
      simple: {
        hue: number;
      };
      custom: ColumnColor[][];
    };
    judgementSet: JudgementSetId;
  };
};

export const defaultSettings: Settings = {
  version: 1,
  volume: 1,
  musicVolume: 1,
  sfxVolume: 0.4,
  scrollSpeed: 20,
  backgroundDim: 0.75,
  backgroundBlur: 0,
  backgroundVideo: {
    enabled: true,
  },
  show300g: true,
  showErrorBar: true,
  audioOffset: 0,
  showFpsCounter: false,
  storeDownloadedBeatmaps: false,
  upscroll: false,
  darkerHoldNotes: true,
  hitPositionOffset: 130,
  noteOffset: 0,
  noteScale: 0.8,
  beatmapProvider: "Mino (catboy.best)",
  customBeatmapProvider: "",
  audioPreviewProvider: "Official osu!",
  customAudioPreviewProvider: "",
  beatmapCoverProvider: "Official osu!",
  customBeatmapCoverProvider: "",
  proxyBeatmapDownloads: false,
  ignoreBeatmapHitsounds: false,
  style: "bars",
  errorBarScale: 1,
  preferMetadataInOriginalLanguage: false,
  unpauseDelay: 1500,
  hideBeatmapSetCovers: false,
  retryOnFail: false,
  performanceMode: false,
  hue: 212,
  stagePosition: 0,
  stageOpacity: 0.5,
  stageSidesOpacity: 1,
  laneWidthAdjustment: 0,
  laneSpacing: 0,
  touch: {
    enabled: true,
    mode: "normal",
    borderOpacity: 0.1,
  },
  keybinds: {
    keyModes: [
      // 1K
      [["Space", null]],
      // 2K
      [
        ["KeyF", null],
        ["KeyJ", null],
      ],
      // 3K
      [
        ["KeyF", null],
        ["Space", null],
        ["KeyJ", null],
      ],
      // 4K
      [
        ["KeyD", null],
        ["KeyF", null],
        ["KeyJ", null],
        ["KeyK", null],
      ],
      // 5K
      [
        ["KeyD", null],
        ["KeyF", null],
        ["Space", null],
        ["KeyJ", null],
        ["KeyK", null],
      ],
      // 6K
      [
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
      ],
      // 7K
      [
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["Space", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
      ],
      // 8K
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 9K
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["Space", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 10K
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyV", null],
        ["KeyN", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 11K (No maps)
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyV", null],
        ["Space", null],
        ["KeyN", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 12K
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyC", null],
        ["KeyV", null],
        ["KeyN", null],
        ["KeyM", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 13K (No maps)
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyC", null],
        ["KeyV", null],
        ["Space", null],
        ["KeyN", null],
        ["KeyM", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 14K
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyX", null],
        ["KeyC", null],
        ["KeyV", null],
        ["KeyN", null],
        ["KeyM", null],
        ["Comma", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 15K (No Maps)
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyX", null],
        ["KeyC", null],
        ["KeyV", null],
        ["Space", null],
        ["KeyN", null],
        ["KeyM", null],
        ["Comma", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 16K
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyZ", null],
        ["KeyX", null],
        ["KeyC", null],
        ["KeyV", null],
        ["KeyN", null],
        ["KeyM", null],
        ["Comma", null],
        ["Period", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 17K (No Maps)
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyZ", null],
        ["KeyX", null],
        ["KeyC", null],
        ["KeyV", null],
        ["Space", null],
        ["KeyN", null],
        ["KeyM", null],
        ["Comma", null],
        ["Period", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
      // 18K
      [
        ["KeyA", null],
        ["KeyS", null],
        ["KeyD", null],
        ["KeyF", null],
        ["KeyG", null],
        ["KeyZ", null],
        ["KeyX", null],
        ["KeyC", null],
        ["KeyV", null],
        ["KeyN", null],
        ["KeyM", null],
        ["Comma", null],
        ["Period", null],
        ["KeyH", null],
        ["KeyJ", null],
        ["KeyK", null],
        ["KeyL", null],
        ["Semicolon", null],
      ],
    ],
    pause: null,
    retry: "Backquote",
    toggleHud: null,
  },
  mods: {
    easy: false,
    noFail: false,
    hardRock: false,
    suddenDeath: false,
    perfect: false,
    perfectSs: false,
    autoplay: false,
    random: false,
    mirror: false,
    constantSpeed: false,
    holdOff: false,
    playbackRate: 1,
    hpOverride: null,
    odOverride: null,
    cover: null,
    percy: null,
  },
  ui: {
    showScore: true,
    showCombo: true,
    showAccuracy: true,
    showJudgement: true,
    earlyLateThreshold: 200,
    showProgressBar: true,
    showHealthBar: true,
    receptorOpacity: 0.5,
    judgementCounter: "right",
    progressDisplay: "bar",
    stageHudYPosition: 0.66,
  },
  skin: {
    colors: {
      mode: "simple",
      simple: {
        hue: 212,
      },
      custom: getAllLaneColors(212, true),
    },
    judgementSet: "azureSnowfall",
  },
} as const;

const useSettingsStoreBase = create(
  persist(
    immer(
      combine(
        defaultSettings,

        (set) => ({
          setSettings: (fn: (draft: Settings) => void) =>
            set((settings) => {
              fn(settings);
            }),

          resetSettings: () => {
            set((settings) => {
              return {
                ...defaultSettings,
                mods: settings.mods,
                keybinds: settings.keybinds,
              };
            });
          },

          resetMods: () =>
            set((settings) => {
              settings.mods = defaultSettings.mods;
            }),
        }),
      ),
    ),
    {
      name: "settings",
      version: 0,
      storage: getLocalStorageConfig({ fillCallback }),
    },
  ),
);

export const useSettingsStore = createSelectors(useSettingsStoreBase);

function fillCallback(settings: Settings) {
  // Set defaults for settings and mods that were added in recent updates
  const filledSettings = {
    ...defaultSettings,
    ...settings,
  };

  filledSettings.touch = {
    ...defaultSettings.touch,
    ...settings.touch,
  };

  if (settings.ui.progressDisplay === undefined) {
    settings.ui.progressDisplay = settings.ui.showProgressBar ? "bar" : null;
  }

  filledSettings.ui = {
    ...defaultSettings.ui,
    ...settings.ui,
  };

  filledSettings.mods = {
    ...defaultSettings.mods,
    ...settings.mods,
  };

  filledSettings.keybinds = {
    ...defaultSettings.keybinds,
    ...settings.keybinds,
  };

  filledSettings.skin = {
    ...defaultSettings.skin,
    ...settings.skin,
  };

  filledSettings.skin.colors.custom.forEach((colorSet) => {
    if (!colorSet[0].holdHead) {
      colorSet.forEach((color) => (color.holdHead = color.tap));
    }
  });

  for (let i = 9; i < 18; i++) {
    if (!filledSettings.keybinds.keyModes[i]) {
      // Set default 10K-18K keybinds
      filledSettings.keybinds.keyModes[i] = [
        ...defaultSettings.keybinds.keyModes[i],
      ];
    }
  }

  // Add secondary keybinds
  for (let i = 0; i < 18; i++) {
    for (let j = 0; j < filledSettings.keybinds.keyModes[i].length; j++) {
      const columnKeybind = filledSettings.keybinds.keyModes[i][j];
      if (typeof columnKeybind === "string" || columnKeybind === null) {
        filledSettings.keybinds.keyModes[i][j] = [columnKeybind, null];
      }
    }
  }

  return filledSettings;
}
