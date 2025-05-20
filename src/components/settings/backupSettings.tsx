import { Checkbox } from "@/components/ui/checkbox";
import { exportBackup as createBackupFile } from "@/lib/backup";
import { cn, downloadBlob } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import BackupUpload from "./backupUpload";

const exportOptionIds = [
  "settingsAndKeybinds",
  "highScoresAndReplays",
  "savedBeatmapSets",
  "storedBeatmapSets",
] as const;
export type ExportOptionId = (typeof exportOptionIds)[number];

const exportOptions: { id: ExportOptionId; label: string }[] = [
  { id: "settingsAndKeybinds", label: "Settings & Keybinds" },
  { id: "highScoresAndReplays", label: "Highscores & Replays" },
  { id: "savedBeatmapSets", label: "Saved Beatmaps" },
  { id: "storedBeatmapSets", label: "Stored Beatmaps" },
] as const;

const BackupSettings = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Partial<Record<ExportOptionId, boolean>>
  >({});

  const toggle = (id: ExportOptionId) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const exportBackup = async () => {
    const options = exportOptions.filter(
      (option) => selectedOptions[option.id],
    );

    try {
      setLoading(true);

      const backupFile = await createBackupFile(
        options.map((option) => option.id),
      );
      const filename = `Backup (${options
        .map((option) => option.label)
        .join(", ")}).womb`;

      downloadBlob(backupFile, filename);

      toast("Backup exported successfully", {
        description: `Saved as ${filename}`,
        duration: 5000,
      });
    } catch (error: any) {
      toast("Error exporting backup", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(className)}>
      <h3 className="mb-2 mt-6 text-lg font-semibold">Backup & Restore</h3>

      <div className="grid grid-cols-2 items-center">
        <div className="text-sm font-semibold text-muted-foreground">
          Import Backup
        </div>

        <BackupUpload />
      </div>

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2">
          <div className="pr-2 text-sm font-semibold text-muted-foreground">
            Export Contents
          </div>

          <div className="space-y-2">
            {exportOptions.map((option) => (
              <Label key={option.id} className="flex items-center gap-2">
                <Checkbox
                  checked={!!selectedOptions[option.id]}
                  onCheckedChange={() => toggle(option.id)}
                />
                <span>{option.label}</span>
              </Label>
            ))}
          </div>
        </div>

        <Button
          disabled={!Object.values(selectedOptions).some((v) => v) || loading}
          className="mt-4 w-full"
          size={"sm"}
          onClick={() => exportBackup()}
        >
          {loading ? <Loader className="animate-spin" /> : "Export Backup"}
        </Button>
      </div>
    </div>
  );
};

export default BackupSettings;
