import { useSettingsStore } from "../../stores/settingsStore";

const HideBeatmapSetCoverWarning = () => {
  const hideBeatmapSetCovers = useSettingsStore.use.hideBeatmapSetCovers();

  if (!hideBeatmapSetCovers) {
    return null;
  }

  return (
    <p className="mt-2 text-sm text-orange-400">
      If you would also like to hide the background during gameplay, set the
      background dim to 100%.
    </p>
  );
};

export default HideBeatmapSetCoverWarning;
