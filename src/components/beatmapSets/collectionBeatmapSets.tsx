import { useCollectionsStore } from "@/stores/collectionsStore";
import { useSearch } from "@tanstack/react-router";
import { Bookmark, InfoIcon } from "lucide-react";
import TextLink from "../textLink";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import CustomBeatmapSets from "./customBeatmapSets";

const CollectionBeatmapSets = ({ className }: { className?: string }) => {
  const search = useSearch({ from: "/" });
  const collection = search.collection;
  const collections = useCollectionsStore((state) => state.collections);

  if (!collection) {
    return null;
  }

  const collectionBeatmapSets = collections[collection];

  if (!collectionBeatmapSets) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">Collection Not Found!</h1>
        <p className="text-muted-foreground text-lg">
          Please change the collection or <TextLink to={"/"}>reset</TextLink>{" "}
          the filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <Alert className="bg-card">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Showing Local Beatmap Data</AlertTitle>
        <AlertDescription>
          Local beatmap data is stored and filtered on your device, so certain
          filters may work differently or may not be available.
        </AlertDescription>
      </Alert>

      <CustomBeatmapSets
        label="You Haven't Added any Beatmaps to This Collection!"
        helpText={
          <>
            Add beatmaps to collections by clicking the{" "}
            <Bookmark className="inline" /> icon.
          </>
        }
        beatmapSets={collectionBeatmapSets}
        className={className}
      />
    </>
  );
};

export default CollectionBeatmapSets;
