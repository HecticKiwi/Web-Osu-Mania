import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn, keyCodeToString, setNestedProperty } from "@/lib/utils";
import { Eraser } from "lucide-react";
import { useSettingsStore } from "../../stores/settingsStore";
import { Button } from "../ui/button";

const KeybindButton = ({
  keybind,
  keybindPath,
  selectedKeybindPath,
  setSelectedKeybindPath,
}: {
  keybind: string | null;
  keybindPath: string;
  selectedKeybindPath: string;
  setSelectedKeybindPath: (value: any | null) => void;
}) => {
  const setSettings = useSettingsStore.use.setSettings();

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (!open) {
          setSelectedKeybindPath(null);
        }
      }}
    >
      <ContextMenuTrigger asChild>
        <Button
          size={"sm"}
          className={cn("h-8", keybind === null && "italic")}
          onClick={() => setSelectedKeybindPath(keybindPath)}
          variant={
            selectedKeybindPath === keybindPath ? "default" : "secondary"
          }
        >
          {keyCodeToString(keybind)}
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setSettings((draft) => {
              setNestedProperty(draft, keybindPath, null);
            });
            // setSelectedKeybindPath(null);
          }}
        >
          <Eraser className="mr-2 h-4 w-4" />
          <span>Clear</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default KeybindButton;
