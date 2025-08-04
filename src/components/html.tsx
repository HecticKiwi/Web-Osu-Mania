"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { Howler } from "howler";
import { CSSProperties, ReactNode, useEffect } from "react";

const Html = ({ children }: { children: ReactNode }) => {
  const hue = useSettingsStore.use.hue();
  const volume = useSettingsStore.use.volume();

  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);

  return (
    <html
      lang="en"
      className="scrollbar scrollbar-track-background scrollbar-thumb-primary"
      style={
        {
          "--hue": hue,
        } as CSSProperties
      }
    >
      {children}
    </html>
  );
};

export default Html;
