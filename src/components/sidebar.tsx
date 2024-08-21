import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FiltersTab from "./filters/filtersTab";
import SettingsTab from "./settings/settingsTab";
import ModsTab from "./mods/modsTab";

const SidebarContent = () => {
  return (
    <>
      <Tabs
        defaultValue="filters"
        className="flex max-h-[500px] flex-grow-0 flex-col"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="mods">Mods</TabsTrigger>
        </TabsList>

        <TabsContent value="filters">
          <Card>
            <CardContent className="p-6">
              <FiltersTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="grow">
          <Card className="h-full overflow-auto">
            <CardContent className="p-6">
              <SettingsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mods">
          <Card>
            <CardContent className="p-6">
              <ModsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SidebarContent;
