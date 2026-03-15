import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCollectionsStore } from "@/stores/collectionsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NULL_COLLECTION } from "./collectionFilter";

const RenameCollectionButton = () => {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const collections = useCollectionsStore((state) => state.collections);
  const setCollections = useCollectionsStore((state) => state.setCollections);
  const collection = search.collection;
  const [isOpen, setisOpen] = useState(false);

  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(80, "Name must be 80 characters or less")
      .refine((val) => val !== NULL_COLLECTION, "Name is unavailable")
      .refine(
        (val) => !collections[val] || val === collection,
        "Collection name already exists",
      ),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: collection || "" },
  });

  const handleOpenChange = (newValue: boolean) => {
    if (newValue) {
      form.reset({ name: collection || "" });
    }

    setisOpen(newValue);
  };

  const onSubmit = (data: { name: string }) => {
    if (!collection) {
      return;
    }

    setCollections((draft) => {
      draft[data.name] = collections[collection];
      delete draft[collection];
    });

    navigate({ to: "/", search: { ...search, collection: data.name } });
    setisOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild disabled={!collection}>
              <Button
                variant={"secondary"}
                size="icon"
                className="shrink-0"
                disabled={!collection}
              >
                <Pencil className="size-5" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rename Collection</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className="w-80 p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default RenameCollectionButton;
