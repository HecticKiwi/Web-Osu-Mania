import { useEffect } from "react";
import { scan } from "react-scan";

// Highlights renders
// https://github.com/aidenybai/react-scan
const ReactScan = () => {
  useEffect(() => {
    scan({
      // Can be laggy when enabled, so only enable if needed
      enabled: false, // process.env.NODE_ENV === "development",
    });
  }, []);

  return <></>;
};

export default ReactScan;
