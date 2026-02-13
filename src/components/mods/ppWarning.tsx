import { useSettingsStore } from "@/stores/settingsStore";

const PpWarning = () => {
  const mods = useSettingsStore.use.mods();

  if (mods.playbackRate === 1) {
    return null;
  }

  return (
    <p className="mt-2 text-sm text-orange-400">
      Note that PP cannot be calculated while song speed mods are active.
    </p>
  );
};

export default PpWarning;
