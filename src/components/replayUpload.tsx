import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ReplayData } from "@/osuMania/systems/replayRecorder";
import { decompressSync } from "fflate";
import { Upload } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useGameStore } from "../stores/gameStore";

const ReplayUpload = () => {
  const startReplay = useGameStore.use.startReplay();
  const startLocalReplayWithBeatmap =
    useGameStore.use.startLocalReplayWithBeatmap();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [pendingLocalReplay, setPendingLocalReplay] =
    useState<ReplayData | null>(null);
  const [pendingLocalBeatmapFile, setPendingLocalBeatmapFile] =
    useState<File | null>(null);
  const [isLocalReplayDialogOpen, setIsLocalReplayDialogOpen] = useState(false);
  const [isMismatchDialogOpen, setIsMismatchDialogOpen] = useState(false);
  const verifyInputRef = useRef<HTMLInputElement>(null);

  const isLocalReplay = (replayData: ReplayData) => {
    const hasOnlineIds =
      replayData.beatmap.id != null && replayData.beatmap.setId != null;

    return !hasOnlineIds && !!replayData.beatmap.hash;
  };

  const loadFile = (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.name.endsWith(".womr")) {
      toast.message("Failed to load replay file", {
        description: "File is not in the .womr format.",
      });

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8 = new Uint8Array(arrayBuffer);
        const decompressed = decompressSync(uint8);
        const jsonStr = new TextDecoder().decode(decompressed);
        const parsedData: ReplayData = JSON.parse(jsonStr);

        if (isLocalReplay(parsedData)) {
          setPendingLocalReplay(parsedData);
          setIsLocalReplayDialogOpen(true);
          return;
        }

        startReplay(parsedData);
      } catch (err) {
        toast.message("Error reading replay file", {
          description: "File is not a valid .womr replay format.",
        });
      }
    };

    reader.onerror = () => {
      toast.message("Error reading file", {
        description:
          reader.error?.message ||
          "An unknown error occurred while loading the file.",
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    loadFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file: File = e.dataTransfer?.files[0];

    setIsDraggingOver(false);
    loadFile(file);
  };

  const handleMapVerification = async (file?: File) => {
    if (!file || !pendingLocalReplay) {
      return;
    }

    if (!file.name.endsWith(".osz")) {
      toast.message("Failed to verify beatmap", {
        description: "Please upload the original .osz beatmap file.",
      });
      return;
    }

    const result = await startLocalReplayWithBeatmap(pendingLocalReplay, file);
    if (result === "started") {
      setPendingLocalReplay(null);
      setPendingLocalBeatmapFile(null);
      setIsLocalReplayDialogOpen(false);
      setIsMismatchDialogOpen(false);
      return;
    }

    if (result === "mismatch") {
      setPendingLocalBeatmapFile(file);
      setIsMismatchDialogOpen(true);
    }
  };

  const confirmMismatchPlayback = async () => {
    if (!pendingLocalReplay || !pendingLocalBeatmapFile) {
      return;
    }

    const result = await startLocalReplayWithBeatmap(
      pendingLocalReplay,
      pendingLocalBeatmapFile,
      true,
    );

    if (result === "started") {
      setPendingLocalReplay(null);
      setPendingLocalBeatmapFile(null);
      setIsLocalReplayDialogOpen(false);
      setIsMismatchDialogOpen(false);
    }
  };

  return (
    <>
      <div
        className="flex w-full items-center"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDraggingOver(false);
          }
        }}
        onDrop={handleDrop}
      >
        <label
          htmlFor="ReplayUpload"
          className={cn(
            "hover:bg-accent flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
            isDraggingOver && "bg-accent",
          )}
        >
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <Upload />
            <p>
              <span className="font-semibold">Click</span> or drag and drop
            </p>
          </div>
          <input
            id="ReplayUpload"
            type="file"
            accept=".womr"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>

      <Dialog
        open={isLocalReplayDialogOpen}
        onOpenChange={(open) => {
          setIsLocalReplayDialogOpen(open);
          if (!open) {
            setPendingLocalReplay(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Local Replay Detected</DialogTitle>
            <DialogDescription>
              This replay was made with a local beatmap. Upload the original
              .osz file to verify the beatmap before playback.
            </DialogDescription>
          </DialogHeader>

          <div>
            <input
              ref={verifyInputRef}
              type="file"
              accept=".osz"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                handleMapVerification(file);
              }}
            />
            <label
              className="hover:bg-accent flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm"
              onClick={() => verifyInputRef.current?.click()}
            >
              <Upload className="size-4" />
              Upload .osz to verify
            </label>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isMismatchDialogOpen}
        onOpenChange={(open) => {
          setIsMismatchDialogOpen(open);
          if (!open) {
            setPendingLocalBeatmapFile(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Beatmap Mismatch</DialogTitle>
            <DialogDescription>
              The replay beatmap hash does not match the uploaded map. Playback
              may be inconsistent. Continue anyway?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="hover:bg-accent rounded-md border px-4 py-2 text-sm"
              onClick={() => setIsMismatchDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
              onClick={confirmMismatchPlayback}
            >
              Okay
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReplayUpload;
