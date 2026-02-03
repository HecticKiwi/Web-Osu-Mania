import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/gameStore";
import FiltersTab from "./filters/filtersTab";
import KeybindsTab from "./keybinds/keybindsTab";
import ModsTab from "./mods/modsTab";
import SettingsTab from "./settings/settingsTab";

const SidebarContent = ({ className }: { className?: string }) => {
  const beatmapId = useGameStore.use.beatmapId();

  return (
    <>
      <Tabs
        defaultValue="filters"
        className={cn(
          "flex h-full flex-col",
          !!beatmapId && "hidden",
          className,
        )}
      >
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="mods">Mods</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="keybinds">Keybinds</TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="h-0 grow">
          <Card className="flex max-h-full flex-col overflow-hidden">
            <CardContent className="overflow-auto p-4 scrollbar scrollbar-track-card sm:p-6">
              <FiltersTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mods" className="h-0 grow">
          <Card className="flex max-h-full flex-col overflow-hidden">
            <CardContent className="overflow-auto p-4 scrollbar scrollbar-track-card sm:p-6">
              <ModsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="h-0 grow">
          <Card className="flex max-h-full flex-col overflow-hidden">
            <CardContent className="overflow-auto p-4 scrollbar scrollbar-track-card sm:p-6">
              <SettingsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keybinds" className="h-0 grow">
          <Card className="flex max-h-full flex-col overflow-hidden">
            <CardContent className="overflow-auto p-4 scrollbar scrollbar-track-card sm:p-6">
              <KeybindsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SidebarContent;
