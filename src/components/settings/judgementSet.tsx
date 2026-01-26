import { SelectItem } from "@/components/ui/select";
import { getJudgementUrl } from "@/lib/utils";
import { JUDGEMENTS } from "@/osuMania/constants";
import {
  JUDGEMENT_SET_OPTIONS,
  useSettingsStore,
} from "@/stores/settingsStore";
import SelectInput from "../inputs/selectInput";
import TextLink from "../textLink";

const JudgementSet = () => {
  const judgementSet = useSettingsStore((state) => state.skin.judgementSet);
  const setSettings = useSettingsStore.use.setSettings();

  const selectedJudgementSet =
    JUDGEMENT_SET_OPTIONS.find((set) => set.id === judgementSet) ||
    JUDGEMENT_SET_OPTIONS[0];

  return (
    <div>
      <div className="grid grid-cols-3">
        {JUDGEMENTS.map((judgement) => (
          <div
            key={`${selectedJudgementSet.id}-${judgement}`}
            className="flex h-12 items-center justify-center overflow-hidden"
          >
            <img
              src={getJudgementUrl(judgement, judgementSet)}
              style={{ scale: selectedJudgementSet.scale }}
            />
          </div>
        ))}
      </div>

      <SelectInput
        label="Judgement Set"
        placeholder="Select Judgement Set"
        className="mt-4"
        selector={(settings) => settings.skin.judgementSet}
        onValueChange={(value) => {
          setSettings((draft) => {
            draft.skin.judgementSet = value;
          });
        }}
      >
        {JUDGEMENT_SET_OPTIONS.sort((a, b) =>
          a.label.localeCompare(b.label),
        ).map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectInput>

      <p className="mt-4 text-sm text-muted-foreground">
        Judgement images are sourced from {selectedJudgementSet.creator} found{" "}
        <TextLink to={selectedJudgementSet.url} target="_blank">
          here
        </TextLink>
        .
      </p>
    </div>
  );
};

export default JudgementSet;
