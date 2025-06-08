"use client";

import { useSettingsStore } from "../../stores/settingsStore";

const UnpauseDelayWarning = () => {
  const unpauseDelay = useSettingsStore.use.unpauseDelay();

  if (unpauseDelay === 0 || unpauseDelay >= 500) {
    return null;
  }

  return (
    <p className="mt-2 text-sm text-orange-400">
      The unpause countdown will not be shown when the delay is under 500ms.
    </p>
  );
};

export default UnpauseDelayWarning;
