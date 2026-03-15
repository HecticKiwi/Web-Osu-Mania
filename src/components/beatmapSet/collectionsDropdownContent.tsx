import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { BeatmapSet } from "@/lib/osuApi";
import { cn } from "@/lib/utils";
import { useCollectionsStore } from "@/stores/collectionsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NULL_COLLECTION } from "../filters/collectionFilter";
import { Input } from "../ui/input";

const CollectionsDropdownContent = ({
  beatmapSet,
}: {
  beatmapSet: BeatmapSet;
}) => {
  const collections = useCollectionsStore((state) => state.collections);
  const setCollections = useCollectionsStore((state) => state.setCollections);

  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(80, "Name must be 80 characters or less")
      .refine((val) => val !== NULL_COLLECTION, "Name is unavailable")
      .refine((val) => !collections[val], "Collection name already exists"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    setCollections((draft) => {
      draft[data.name] = [beatmapSet];
    });

    form.reset();
  };

  return (
    <>
      <div className="scrollbar scrollbar-track-card max-h-48 overflow-y-auto">
        {Object.keys(collections).length === 0 && (
          <div className="text-muted-foreground w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-1.5 text-sm italic">
            No Collections
          </div>
        )}
        {Object.entries(collections)
          .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
          .map(([name, beatmapSets]) => (
            <DropdownMenuItem
              key={name}
              className="gap-2"
              onClick={() => {
                setCollections((draft) => {
                  if (beatmapSets.some((b) => b.id === beatmapSet.id)) {
                    draft[name] = draft[name].filter(
                      (b) => b.id !== beatmapSet.id,
                    );
                  } else {
                    draft[name].push(beatmapSet);
                  }
                });
              }}
              title={name}
            >
              <Check
                className={cn(
                  "invisible size-4 shrink-0",
                  beatmapSets.some((b) => b.id === beatmapSet.id) && "visible",
                )}
              />
              <span className="flex-1 truncate">{name}</span>
            </DropdownMenuItem>
          ))}
      </div>

      <DropdownMenuSeparator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="New Collection"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default CollectionsDropdownContent;
