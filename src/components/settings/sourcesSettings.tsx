import { cn } from "@/lib/utils";
import type {
  AudioPreviewProvider,
  BeatmapCoverProvider,
  BeatmapProvider,
} from "../../stores/settingsStore";
import {
  AUDIO_PREVIEW_PROVIDERS,
  BEATMAP_API_PROVIDERS,
  BEATMAP_COVER_PROVIDERS,
  useSettingsStore,
} from "../../stores/settingsStore";
import SelectInput from "../inputs/selectInput";
import StringInput from "../inputs/stringInput";
import SwitchInput from "../inputs/switchInput";
import { SelectItem } from "../ui/select";

const SourcesSettings = ({ className }: { className?: string }) => {
  const beatmapProvider = useSettingsStore.use.beatmapProvider();
  const audioPreviewProvider = useSettingsStore.use.audioPreviewProvider();
  const beatmapCoverProvider = useSettingsStore.use.beatmapCoverProvider();
  const setSettings = useSettingsStore.use.setSettings();

  return (
    <div className={cn(className)}>
      <h3 className="mb-2 text-lg font-semibold">Sources</h3>

      <div className="space-y-4">
        <SelectInput
          label="Beatmap Provider"
          selector={(state) => state.beatmapProvider}
          onValueChange={(newBeatmapProvider: string) =>
            setSettings((draft) => {
              draft.beatmapProvider = newBeatmapProvider as BeatmapProvider;
            })
          }
        >
          {Object.entries(BEATMAP_API_PROVIDERS).map(([name, url]) => (
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

        {beatmapProvider === "Custom" && (
          <>
            <StringInput
              label="Custom Beatmap Provider"
              selector={(state) => state.customBeatmapProvider}
              onChange={(e) => {
                setSettings((draft) => {
                  draft.customBeatmapProvider = e.target.value;
                });
              }}
            />

            <p className="mt-1 text-sm text-orange-400">
              Custom URLs should replace the beatmap set ID route segment with
              $setId (e.g. NeriNyan uses "https://api.nerinyan.moe/d/$setId").
            </p>
          </>
        )}

        {beatmapProvider === "SayoBot" && (
          <p className="mt-1 text-sm text-orange-400">
            There may be parsing errors when downloading maps from SayoBot. If
            this happens, try switching to a different provider.
          </p>
        )}

        <SelectInput
          label="Audio Preview Provider"
          selector={(state) => state.audioPreviewProvider}
          onValueChange={(newAudioPreviewProvider: string) =>
            setSettings((draft) => {
              draft.audioPreviewProvider =
                newAudioPreviewProvider as AudioPreviewProvider;
            })
          }
        >
          {Object.entries(AUDIO_PREVIEW_PROVIDERS).map(([name]) => (
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

        {audioPreviewProvider === "Custom" && (
          <>
            <StringInput
              label="Custom Audio Preview Provider"
              selector={(state) => state.customAudioPreviewProvider}
              onChange={(e) => {
                setSettings((draft) => {
                  draft.customAudioPreviewProvider = e.target.value;
                });
              }}
            />

            <p className="mt-1 text-sm text-orange-400">
              Custom URLs should replace the beatmap set ID route segment with
              $setId (e.g. Official osu! uses
              "https://b.ppy.sh/preview/$setId.mp3").
            </p>
          </>
        )}

        <SelectInput
          label="Image Provider"
          selector={(state) => state.beatmapCoverProvider}
          onValueChange={(newBeatmapCoverProvider: string) =>
            setSettings((draft) => {
              draft.beatmapCoverProvider =
                newBeatmapCoverProvider as BeatmapCoverProvider;
            })
          }
        >
          {Object.entries(BEATMAP_COVER_PROVIDERS).map(([name]) => (
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

        {beatmapCoverProvider === "Custom" && (
          <>
            <StringInput
              label="Custom Image Provider"
              selector={(state) => state.customBeatmapCoverProvider}
              onChange={(e) => {
                setSettings((draft) => {
                  draft.customBeatmapCoverProvider = e.target.value;
                });
              }}
            />

            <p className="mt-1 text-sm text-orange-400">
              Custom URLs should replace the beatmap set ID route segment with
              $setId (e.g. Official osu! uses
              "https://assets.ppy.sh/beatmaps/$setId/covers/cover.jpg").
            </p>
          </>
        )}

        <SwitchInput
          label="Proxy Downloads"
          selector={(state) => state.proxyBeatmapDownloads}
          onCheckedChange={(checked) => {
            setSettings((draft) => {
              draft.proxyBeatmapDownloads = checked;
            });
          }}
        />

        <p className="text-muted-foreground mt-4 text-sm">
          If the beatmap providers are blocked on your network, bypass it by
          proxying beatmap downloads through this website's server. ONLY ENABLE
          IF YOU HAVE TO; may result in delayed downloads or rate limiting.
        </p>
      </div>
    </div>
  );
};

export default SourcesSettings;
