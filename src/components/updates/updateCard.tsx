import TypeBadge from "@/components/updates/typeBadge";
import type { UpdateEntry } from "@/routes/updates";
import { Milestone } from "lucide-react";

const UpdateCard = ({ entry }: { entry: UpdateEntry }) => {
  const date = new Date(`${entry.date}T00:00:00Z`);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex gap-6">
      {/* Timeline marker and line */}
      <div className="relative flex flex-col items-center">
        <div className="border-border/60 bg-card text-primary z-10 mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl border">
          <Milestone className="size-4" />
        </div>
        <div className="bg-border/50 absolute top-1 h-full w-px" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-10">
        <time
          dateTime={entry.date}
          className="text-foreground mb-3 block text-sm font-semibold tracking-tight"
        >
          {formattedDate}
        </time>

        {entry.items.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {entry.items.map((item, idx) => (
              <div
                key={idx}
                className="border-border/60 bg-card hover:border-border rounded-xl border px-5 py-4 transition-colors"
              >
                <TypeBadge type={item.type} />
                <p className="text-muted-foreground mt-1 flex-1 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateCard;
