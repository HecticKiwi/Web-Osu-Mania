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

export function parseCategoryParam(param?: string | null): Category {
  if (param && CATEGORIES.includes(param as Category)) {
    return param as Category;
  }

  return DEFAULT_CATEGORY;
}
