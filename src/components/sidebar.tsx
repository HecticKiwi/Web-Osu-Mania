import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FiltersTab from "./filters/filtersTab";
import ModsTab from "./mods/modsTab";
import SettingsTab from "./settings/settingsTab";

const SidebarContent = () => {
  return (
    <>
      <Tabs defaultValue="filters" className="flex h-full flex-col">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="mods">Mods</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="h-0 grow">
          <Card className="flex max-h-[100%] flex-col overflow-hidden">
            <CardContent className="overflow-auto p-6 scrollbar scrollbar-track-card">
              <FiltersTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mods" className="h-0 grow">
          <Card className="flex max-h-[100%] flex-col overflow-hidden">
            <CardContent className="overflow-auto p-6 scrollbar scrollbar-track-card">
              <ModsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="h-0 grow">
          <Card className="flex max-h-[100%] flex-col overflow-hidden">
            <CardContent className="overflow-auto p-6 scrollbar scrollbar-track-card">
              <SettingsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SidebarContent;
