import CategoryBar from "@/components/filters/categoryBar";
import DifficultySlider from "@/components/filters/difficultySlider";
import KeysBar from "@/components/filters/keysBar";
import SortBar from "@/components/filters/sortBar";
import Keybinds from "@/components/keybinds";
import Search from "@/components/search";
import Settings from "@/components/settings/settings";

const FiltersTab = () => {
  return (
    <>
      <div className="space-y-4">
        <Search />
        <CategoryBar />
        <SortBar />
        <KeysBar />
        <DifficultySlider />

        <div className="flex items-center gap-2">
          <Settings />
          <Keybinds />
        </div>
      </div>
    </>
  );
};

export default FiltersTab;
