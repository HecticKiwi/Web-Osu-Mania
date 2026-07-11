import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { downloadBackup } from "@/lib/backup";
import { useState } from "react";
import { toast } from "sonner";
import FilterableList from "../filterableList";
import BackupUpload from "./backupUpload";

const exportOptionIds = [
  "settingsAndKeybinds",
  "highScoresAndReplays",
  "collections",
  "storedBeatmapSets",
] as const;
export type ExportOptionId = (typeof exportOptionIds)[number];

const exportOptions: { id: ExportOptionId; label: string }[] = [
  { id: "settingsAndKeybinds", label: "Settings & Keybinds" },
  { id: "highScoresAndReplays", label: "Highscores & Replays" },
  { id: "collections", label: "Collections" },
  { id: "storedBeatmapSets", label: "Stored Beatmaps" },
] as const;

const BackupAndRestoreSettings = ({
  className,
  searchQuery,
}: {
  className?: string;
  searchQuery?: string;
}) => {
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

      const date = new Date();
      const dateString = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const filename = `Backup ${dateString} (${options
        .map((option) => option.label)
        .join(", ")}).zip`;

      await downloadBackup(
        filename,
        options.map((option) => option.id),
      );

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
    <FilterableList
      className={className}
      title="Backup & Restore"
      items={[
        {
          label: "Import Backup (.zip)",
          render: ({ label }) => (
            <div className="grid grid-cols-2 items-center">
              <div className="text-muted-foreground text-sm font-semibold">
                {label}
              </div>

              <BackupUpload />
            </div>
          ),
        },
        {
          label: "Export Contents",
          searchTags: [
            ...exportOptions.map((option) => option.label),
            "Export Backup",
          ],
          render: ({ label }) => (
            <>
              <div className="grid grid-cols-2">
                <div className="text-muted-foreground pr-2 text-sm font-semibold">
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
                disabled={
                  !Object.values(selectedOptions).some((v) => v) || loading
                }
                className="mt-4 w-full"
                size={"sm"}
                onClick={() => exportBackup()}
              >
                Export Backup
              </Button>
            </>
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default BackupAndRestoreSettings;
