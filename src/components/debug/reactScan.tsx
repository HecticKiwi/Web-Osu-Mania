"use client";

import { useEffect } from "react";
import { scan } from "react-scan";

// Highlights renders
// https://github.com/aidenybai/react-scan
const ReactScan = () => {
  useEffect(() => {
    scan({
      enabled: process.env.NODE_ENV === "development",
    });
  }, []);

  return <></>;
};

export default ReactScan;
