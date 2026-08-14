import { Input } from "@/components/ui/input";
import type { ComponentType } from "react";
import { useState } from "react";
import BackupAndRestoreSettings from "./backupAndRestore/backupAndRestoreSettings";
import BeatmapManagementSettings from "./beatmapManagement/beatmapManagementSettings";
import ClearHighScoresButton from "./clearHighScoresButton";
import DisplaySettings from "./display/displaySettings";
import FilterableList from "./filterableList";
import GameplaySettings from "./gameplay/gameplaySettings";
import GeneralSettings from "./general/generalSettings";
import ReplaySettings from "./replay/replaySettings";
import ResetSettingsButton from "./resetSettingsButton";
import SettingsNavigation from "./settingsNavigation";
import SkinSettings from "./skin/skinSettings";
import SourcesSettings from "./sources/sourcesSettings";
import TouchControlsSettings from "./touchControls/touchControlsSettings";
import VolumeSettings from "./volume/volumeSettings";

export const settingsContainerId = "settings-container";

export interface SettingsSectionProps {
  title: string;
  searchQuery?: string;
}

const sections: {
  title: string;
  Component: ComponentType<SettingsSectionProps>;
}[] = [
  {
    title: "General",
    Component: GeneralSettings,
  },
  {
    title: "Gameplay",
    Component: GameplaySettings,
  },
  {
    title: "Touch Controls",
    Component: TouchControlsSettings,
  },
  {
    title: "Skin",
    Component: SkinSettings,
  },
  {
    title: "Display",
    Component: DisplaySettings,
  },
  {
    title: "Volume",
    Component: VolumeSettings,
  },
  {
    title: "Replays",
    Component: ReplaySettings,
  },
  {
    title: "Beatmap Management",
    Component: BeatmapManagementSettings,
  },
  {
    title: "Sources",
    Component: SourcesSettings,
  },
  {
    title: "Backup & Restore",
    Component: BackupAndRestoreSettings,
  },
] as const;

const SettingsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="flex gap-2 p-4 sm:p-6">
        <Input
          type="text"
          placeholder="Search settings..."
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
        />

        <SettingsNavigation
          sectionTitles={sections.map((section) => section.title)}
        />
      </div>

      <div
        id={settingsContainerId}
        className="scrollbar scrollbar-track-card relative overflow-auto p-4 pt-0 sm:p-6 sm:pt-0"
      >
        {sections.map((section) => (
          <section.Component
            key={section.title}
            title={section.title}
            searchQuery={searchQuery}
          />
        ))}

        <FilterableList
          className="mt-8 border-t pt-8"
          items={[
            {
              label: "Clear High Scores",
              render: ({ label }) => (
                <ClearHighScoresButton className="w-full">
                  {label}
                </ClearHighScoresButton>
              ),
            },
            {
              label: "Reset Settings",
              render: ({ label }) => (
                <ResetSettingsButton className="w-full">
                  {label}
                </ResetSettingsButton>
              ),
            },
          ]}
          searchQuery={searchQuery}
        />
      </div>
    </>
  );
};

export default SettingsTab;
