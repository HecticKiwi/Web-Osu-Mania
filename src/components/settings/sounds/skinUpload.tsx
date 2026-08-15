import { parseOskSounds } from "@/lib/skinParser";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

const SkinUpload = () => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const loadFile = async (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.name.endsWith(".osk")) {
      toast.message("Failed to load skin file", {
        description: "File is not in the .osk format.",
      });

      return;
    }

    try {
      await parseOskSounds(file);
      toast("Hitsounds imported successfully.");
    } catch (error) {
      toast("An error occurred while importing hitsounds.");
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
        htmlFor="skinHitsoundUpload"
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
          id="skinHitsoundUpload"
          type="file"
          accept=".osk"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default SkinUpload;
