import { cn } from "@/lib/utils";

export type FilterableItem = {
  label: string;
  searchTags?: readonly string[];
  render: ({ label }: { label: string }) => React.ReactNode;
};

const FilterableList = ({
  title,
  items,
  searchQuery,
  className,
}: {
  title?: string;
  items: FilterableItem[];
  searchQuery?: string;
  className?: string;
}) => {
  const visibleItems = items.filter((item) => {
    if (!searchQuery) {
      return true;
    }

    return [item.label, ...(item.searchTags ?? [])].some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className={cn("mt-6 flex flex-col gap-2", className)}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="space-y-4">
        {visibleItems.map((item) => item.render({ label: item.label }))}
      </div>
    </div>
  );
};

export default FilterableList;
