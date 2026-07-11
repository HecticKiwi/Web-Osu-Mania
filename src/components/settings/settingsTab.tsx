import { Input } from "@/components/ui/input";
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
import SkinSettings from "./skin/skinSettings";
import SourcesSettings from "./sources/sourcesSettings";
import TouchControlsSettings from "./touchControls/touchControlsSettings";
import VolumeSettings from "./volume/volumeSettings";

const SettingsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="bg-card sticky -top-4 z-50 -m-4 px-4 pt-4 pb-6 sm:-top-6 sm:-m-6 sm:px-6 sm:pt-6">
        <Input
          type="text"
          placeholder="Search settings..."
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
        />
      </div>

      <GeneralSettings searchQuery={searchQuery} />

      <GameplaySettings searchQuery={searchQuery} />

      <TouchControlsSettings searchQuery={searchQuery} />

      <SkinSettings searchQuery={searchQuery} />

      <DisplaySettings searchQuery={searchQuery} />

      <VolumeSettings searchQuery={searchQuery} />
      <ReplaySettings searchQuery={searchQuery} />
      <BeatmapManagementSettings searchQuery={searchQuery} />
      <SourcesSettings searchQuery={searchQuery} />
      <BackupAndRestoreSettings searchQuery={searchQuery} />

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
    </>
  );
};

export default SettingsTab;
