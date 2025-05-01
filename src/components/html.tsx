"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { CSSProperties, ReactNode } from "react";

const Html = ({ children }: { children: ReactNode }) => {
  const hue = useSettingsStore.use.hue();

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
