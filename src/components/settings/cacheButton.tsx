"use client";

import { Idb } from "@/lib/idb";
import { cn } from "@/lib/utils";
import { filesize } from "filesize";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const CacheButton = ({ className }: { className?: string }) => {
  const [cacheUsage, setCacheUsage] = useState<number | null>(null);

  const calculateCacheUsage = async () => {
    const idb = new Idb();
    const beatmapCount = await idb.getBeatmapCount();

    if (beatmapCount === 0) {
      setCacheUsage(0);
      return;
    }

    const storage = await navigator.storage.estimate();

    if (!storage.usage) {
      throw new Error("Could not determine cache usage.");
    }

    setCacheUsage(storage.usage);
  };

  useEffect(() => {
    calculateCacheUsage();
  }, []);

  const clearCache = async () => {
    const idb = new Idb();
    await idb.clearBeatmapSets();

    setCacheUsage(null);
    await calculateCacheUsage();
  };

  return (
    <Button
      className={cn("mt-8 w-full", className)}
      size={"sm"}
      onClick={() => clearCache()}
      disabled={!cacheUsage}
    >
      {cacheUsage !== null ? (
        <>Clear Cache ({filesize(cacheUsage)})</>
      ) : (
        <>
          <Loader2Icon className="animate-spin" />
        </>
      )}
    </Button>
  );
};

export default CacheButton;
