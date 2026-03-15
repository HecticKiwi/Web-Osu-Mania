import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCollectionsStore } from "@/stores/collectionsStore";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import DeleteCollectionButton from "./deleteCollectionButton";
import RenameCollectionButton from "./renameCollectionButton";

export const NULL_COLLECTION = "_null";

const CollectionFilter = ({ className }: { className?: string }) => {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const collection = search.collection;
  const collections = useCollectionsStore((state) => state.collections);

  const collectionValue =
    typeof collection === "string" ? collection : NULL_COLLECTION;

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Collections</span>

        <div className="mt-2 flex items-center gap-2">
          <Select
            value={collectionValue}
            onValueChange={(value) => {
              if (value === NULL_COLLECTION) {
                navigate({
                  to: "/",
                  search: { ...search, collection: undefined },
                });
              } else {
                navigate({ to: "/", search: { ...search, collection: value } });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              <SelectGroup>
                <SelectItem value={NULL_COLLECTION}>All Beatmaps</SelectItem>

                <DropdownMenuSeparator />

                {Object.keys(collections).length === 0 && (
                  <div className="text-muted-foreground w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-1.5 text-sm italic">
                    No Collections
                  </div>
                )}
                {Object.keys(collections)
                  .sort((a, b) => a.localeCompare(b))
                  .map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <RenameCollectionButton />
          <DeleteCollectionButton />
        </div>
      </div>
    </>
  );
};

export default CollectionFilter;
