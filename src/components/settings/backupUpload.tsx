"use client";

import { importBackup } from "@/lib/backup";
import { cn } from "@/lib/utils";
import { Loader, Upload } from "lucide-react";
import { ChangeEvent, DragEvent, useState } from "react";
import { toast } from "sonner";

const BackupUpload = () => {
  const [loading, setLoading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const loadFile = async (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.name.endsWith(".zip")) {
      toast.message("Failed to parse backup file", {
        description: "File is not in a .zip format.",
      });

      return;
    }

    try {
      setLoading(true);
      await importBackup(file);
    } catch (error: any) {
      toast.message("Error parsing backup file", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
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

  return (
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
        htmlFor="backupUpload"
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors hover:bg-accent",
          isDraggingOver && "bg-accent",
        )}
      >
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <Upload />
              <p>
                <span className="font-semibold">Click</span> or drag and drop
              </p>
            </>
          )}
        </div>
        <input
          id="backupUpload"
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default BackupUpload;
