"use client";

import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { ChangeEvent, DragEvent, useState } from "react";
import { toast } from "sonner";
import { useGameContext } from "./providers/gameProvider";


const ReplayUpload = () => {
  const { setUploadedReplay } = useGameContext();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const loadFile = (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.name.endsWith(".womr")) {
      toast.message("Failed to load beatmap file", {
        description: "File is not in the .womr format.",
      });

      return;
    }

    setUploadedReplay(file);
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
        htmlFor="ReplayUpload"
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors hover:bg-accent",
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
  );
};

export default ReplayUpload;
