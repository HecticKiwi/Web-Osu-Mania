"use client";

import { useContext } from "react";
import { settingsContext } from "../providers/settingsProvider";
import { Switch } from "../ui/switch";

const ModsTab = () => {
  const { settings, resetSettings, updateSettings } =
    useContext(settingsContext);

  if (!settings) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Autoplay
          </div>
          <Switch
            checked={settings.autoplay}
            onCheckedChange={(checked) => updateSettings({ autoplay: checked })}
          />
        </div>
      </div>
    </>
  );
};

export default ModsTab;
