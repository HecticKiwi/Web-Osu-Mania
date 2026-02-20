import { cn } from "@/lib/utils";
import type { UpdateType } from "@/routes/updates";
import { Bug, Megaphone, Plus, Zap } from "lucide-react";

const config = {
  addition: {
    label: "Addition",
    icon: <Plus className="size-3" />,
    className: "bg-green-500/10 text-green-400",
  },
  fix: {
    label: "Fix",
    icon: <Bug className="size-3" />,
    className: "bg-red-500/10 text-red-400",
  },
  improvement: {
    label: "Improvement",
    icon: <Zap className="size-3" />,
    className: "bg-amber-500/10 text-amber-400",
  },
  announcement: {
    label: "Announcement",
    icon: <Megaphone className="size-4" />,
    className: "bg-blue-500/10 text-blue-400",
  },
} as const;

const TypeBadge = ({ type }: { type: UpdateType }) => {
  const { label, icon, className } = config[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
};

export default TypeBadge;
