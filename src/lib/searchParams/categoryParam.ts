export const CATEGORIES = [
  "Any",
  "Has Leaderboard",
  "Ranked",
  "Qualified",
  "Loved",
  "Pending",
  "WIP",
  "Graveyard",
] as const;
export type Category = (typeof CATEGORIES)[number];
export const DEFAULT_CATEGORY: Category = "Has Leaderboard";

export const CUSTOM_CATEGORIES = ["Saved", "Stored"];
export type CustomCategory = (typeof CUSTOM_CATEGORIES)[number];

export function parseCategoryParam(
  param?: string | null,
): Category | CustomCategory {
  if (
    CATEGORIES.includes(param as Category) ||
    CUSTOM_CATEGORIES.includes(param as CustomCategory)
  ) {
    return param as Category;
  }

  return DEFAULT_CATEGORY;
}
