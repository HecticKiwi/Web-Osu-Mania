import { createSelectors, getLocalStorageConfig } from "@/lib/zustand";
import { getAllLaneColors } from "@/osuMania/constants";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const BEATMAP_API_PROVIDERS = {
  "Mino (catboy.best)": "https://catboy.best/d/$setId",
  NeriNyan: "https://api.nerinyan.moe/d/$setId",
  SayoBot: "https://dl.sayobot.cn/beatmaps/download/$setId",
} as const;

export type BeatmapProvider = keyof typeof BEATMAP_API_PROVIDERS | "Custom";

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
  beatmapProvider: BeatmapProvider;
  customBeatmapProvider: string;
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
  laneWidthAdjustment: number;
  touch: {
    mode: TouchMode;
    borderOpacity: number;
  };
  keybinds: {
    keyModes: (string | null)[][];
    pause: string | null;
    retry: string | null;
  };
  /**
   * When adding mods, don't forget to
   * 1. Add the mod strings to getModStrings()
   * 2. Make necessary changes to replay.ts so the mod is stored in replays properly
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
  };
  ui: {
    showScore: boolean;
    showCombo: boolean;
    showAccuracy: boolean;
    showJudgement: boolean;
    earlyLateThreshold: EarlyLateThreshold;
    showProgressBar: boolean;
    showHealthBar: boolean;
    receptorOpacity: number;
    judgementCounter: JudgementCounterPosition | null;
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
  beatmapProvider: "Mino (catboy.best)",
  customBeatmapProvider: "",
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
  laneWidthAdjustment: 0,
  touch: {
    mode: "normal",
    borderOpacity: 0.1,
  },
  keybinds: {
    keyModes: [
      ["Space"], // 1K
      ["KeyF", "KeyJ"], // 2K
      ["KeyF", "Space", "KeyJ"], // 3K
      ["KeyD", "KeyF", "KeyJ", "KeyK"], // 4K
      ["KeyD", "KeyF", "Space", "KeyJ", "KeyK"], // 5K
      ["KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL"], // 6K
      ["KeyS", "KeyD", "KeyF", "Space", "KeyJ", "KeyK", "KeyL"], // 7K
      ["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon"], // 8K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "Space",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 9K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyV",
        "KeyN",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 10K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyV",
        "Space",
        "KeyN",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 11K (No maps)
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyC",
        "KeyV",
        "KeyN",
        "KeyM",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 12K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyC",
        "KeyV",
        "Space",
        "KeyN",
        "KeyM",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 13K (No maps)
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyN",
        "KeyM",
        "Comma",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 14K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyX",
        "KeyC",
        "KeyV",
        "Space",
        "KeyN",
        "KeyM",
        "Comma",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 15K (No Maps)
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyN",
        "KeyM",
        "Comma",
        "Period",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 16K
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyV",
        "Space",
        "KeyN",
        "KeyM",
        "Comma",
        "Period",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 17K (No Maps)
      [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyG",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyN",
        "KeyM",
        "Comma",
        "Period",
        "KeyH",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
      ], // 18K
    ],
    pause: null,
    retry: "Backquote",
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
  },
  ui: {
    showScore: true,
    showCombo: true,
    showAccuracy: true,
    showJudgement: true,
    earlyLateThreshold: 200,
    showProgressBar: true,
    showHealthBar: true,
    receptorOpacity: 1,
    judgementCounter: "right",
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

  for (let i = 9; i < 18; i++) {
    if (!filledSettings.keybinds.keyModes[i]) {
      // Set default 10K-18K keybinds
      filledSettings.keybinds.keyModes[i] = [
        ...defaultSettings.keybinds.keyModes[i],
      ];
    }
  }

  return filledSettings;
}
