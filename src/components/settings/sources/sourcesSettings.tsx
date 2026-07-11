import SelectInput from "@/components/inputs/selectInput";
import StringInput from "@/components/inputs/stringInput";
import SwitchInput from "@/components/inputs/switchInput";
import { SelectItem } from "@/components/ui/select";
import type {
  AudioPreviewProvider,
  BeatmapCoverProvider,
  BeatmapProvider,
} from "@/stores/settingsStore";
import {
  AUDIO_PREVIEW_PROVIDERS,
  BEATMAP_API_PROVIDERS,
  BEATMAP_COVER_PROVIDERS,
  useSettingsStore,
} from "@/stores/settingsStore";
import FilterableList from "../filterableList";

const SourcesSettings = ({
  className,
  searchQuery,
}: {
  className?: string;
  searchQuery?: string;
}) => {
  const beatmapProvider = useSettingsStore.use.beatmapProvider();
  const audioPreviewProvider = useSettingsStore.use.audioPreviewProvider();
  const beatmapCoverProvider = useSettingsStore.use.beatmapCoverProvider();
  const setSettings = useSettingsStore.use.setSettings();

  return (
    <FilterableList
      className={className}
      title="Sources"
      items={[
        {
          label: "Beatmap Provider",
          searchTags: Object.keys(BEATMAP_API_PROVIDERS),
          render: ({ label }) => (
            <SelectInput
              label={label}
              settingPath="beatmapProvider"
              onValueChange={(newBeatmapProvider: string) =>
                setSettings((draft) => {
                  draft.beatmapProvider = newBeatmapProvider as BeatmapProvider;
                })
              }
              description={
                beatmapProvider === "SayoBot" ? (
                  <span className="text-orange-400">
                    There may be parsing errors when downloading maps from
                    SayoBot. If this happens, try switching to a different
                    provider.
                  </span>
                ) : undefined
              }
            >
              {Object.keys(BEATMAP_API_PROVIDERS).map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}

              <SelectItem
                key={"Custom"}
                value={"Custom"}
                className="text-muted-foreground italic"
              >
                Custom
              </SelectItem>
            </SelectInput>
          ),
        },
        {
          label: "Custom Beatmap Provider",
          render: ({ label }) => {
            if (beatmapProvider !== "Custom") {
              return null;
            }

            return (
              <StringInput
                label={label}
                selector={(state) => state.customBeatmapProvider}
                onChange={(e) => {
                  setSettings((draft) => {
                    draft.customBeatmapProvider = e.target.value;
                  });
                }}
                description={
                  <span className="text-orange-400">
                    Custom URLs should replace the beatmap set ID route segment
                    with $setId (e.g. NeriNyan uses
                    "https://api.nerinyan.moe/d/$setId").
                  </span>
                }
              />
            );
          },
        },
        {
          label: "Audio Preview Provider",
          searchTags: Object.keys(AUDIO_PREVIEW_PROVIDERS),
          render: ({ label }) => (
            <SelectInput
              label={label}
              settingPath="audioPreviewProvider"
              onValueChange={(newAudioPreviewProvider: string) =>
                setSettings((draft) => {
                  draft.audioPreviewProvider =
                    newAudioPreviewProvider as AudioPreviewProvider;
                })
              }
            >
              {Object.keys(AUDIO_PREVIEW_PROVIDERS).map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}

              <SelectItem
                key={"Custom"}
                value={"Custom"}
                className="text-muted-foreground italic"
              >
                Custom
              </SelectItem>
            </SelectInput>
          ),
        },
        {
          label: "Custom Audio Preview Provider",
          render: ({ label }) => {
            if (audioPreviewProvider !== "Custom") {
              return null;
            }

            return (
              <StringInput
                label={label}
                selector={(state) => state.customAudioPreviewProvider}
                onChange={(e) => {
                  setSettings((draft) => {
                    draft.customAudioPreviewProvider = e.target.value;
                  });
                }}
                description={
                  <span className="text-orange-400">
                    Custom URLs should replace the beatmap set ID route segment
                    with $setId (e.g. Official osu! uses
                    "https://b.ppy.sh/preview/$setId.mp3").
                  </span>
                }
              />
            );
          },
        },
        {
          label: "Image Provider",
          searchTags: Object.keys(BEATMAP_COVER_PROVIDERS),
          render: ({ label }) => (
            <SelectInput
              label={label}
              settingPath="beatmapCoverProvider"
              onValueChange={(newBeatmapCoverProvider: string) =>
                setSettings((draft) => {
                  draft.beatmapCoverProvider =
                    newBeatmapCoverProvider as BeatmapCoverProvider;
                })
              }
            >
              {Object.keys(BEATMAP_COVER_PROVIDERS).map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}

              <SelectItem
                key={"Custom"}
                value={"Custom"}
                className="text-muted-foreground italic"
              >
                Custom
              </SelectItem>
            </SelectInput>
          ),
        },
        {
          label: "Custom Image Provider Label",
          render: ({ label }) => {
            if (beatmapCoverProvider !== "Custom") {
              return null;
            }

            return (
              <StringInput
                label={label}
                selector={(state) => state.customBeatmapCoverProvider}
                onChange={(e) => {
                  setSettings((draft) => {
                    draft.customBeatmapCoverProvider = e.target.value;
                  });
                }}
                description={
                  <span className="text-orange-400">
                    Custom URLs should replace the beatmap set ID route segment
                    with $setId (e.g. Official osu! uses
                    "https://assets.ppy.sh/beatmaps/$setId/covers/cover.jpg").
                  </span>
                }
              />
            );
          },
        },
        {
          label: "Proxy Downloads",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="proxyBeatmapDownloads"
              onCheckedChange={(checked) => {
                setSettings((draft) => {
                  draft.proxyBeatmapDownloads = checked;
                });
              }}
              description={
                <span>
                  If the beatmap providers are blocked on your network, bypass
                  it by proxying beatmap downloads through this website's
                  server. ONLY ENABLE IF YOU HAVE TO; may result in delayed
                  downloads or rate limiting.
                </span>
              }
            />
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default SourcesSettings;
