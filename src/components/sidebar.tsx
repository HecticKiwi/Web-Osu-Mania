import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FiltersTab from "./filters/filtersTab";
import SettingsTab from "./settings/settingsTab";
import ModsTab from "./mods/modsTab";

const SidebarContent = () => {
  return (
    <>
      <Tabs defaultValue="filters" className="flex h-full flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="mods">Mods</TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="h-0 grow">
          <Card className="flex max-h-[100%] flex-col overflow-hidden">
            <CardContent className="overflow-auto p-6 scrollbar scrollbar-track-card scrollbar-thumb-primary">
              <FiltersTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="h-0 grow">
          <Card className="flex max-h-[100%] flex-col overflow-hidden">
            <CardContent className="overflow-auto p-6 scrollbar scrollbar-track-card scrollbar-thumb-primary">
              <SettingsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mods" className="h-0 grow">
          <Card className="flex max-h-[100%] flex-col overflow-hidden">
            <CardContent className="overflow-auto p-6 scrollbar scrollbar-track-card scrollbar-thumb-primary">
              <ModsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SidebarContent;
