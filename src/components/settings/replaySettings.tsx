import { cn } from "@/lib/utils";
import ReplayUpload from "../replayUpload";

const BeatmapSettings = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className)}>
      <h3 className="mb-2 text-lg font-semibold">Replays</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Upload Replay
          </div>

          <ReplayUpload />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          If you have replay files (.womr format) downloaded, you can watch them
          here. Click the dashed box or drag a replay file into it.
        </p>
      </div>
    </div>
  );
};

export default BeatmapSettings;
