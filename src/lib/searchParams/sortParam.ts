export const SORT_CRITERIA = [
  "title",
  "artist",
  "difficulty",
  "ranked",
  "rating",
  "plays",
  "favourites",
  "relevance",
] as const;
export type SortCriteria = (typeof SORT_CRITERIA)[number];
export const DEFAULT_SORT_CRITERIA: SortCriteria = "ranked";

export function parseSortCriteriaParam(param?: string | null): SortCriteria {
  if (param && SORT_CRITERIA.includes(param as SortCriteria)) {
    return param as SortCriteria;
  }

  return DEFAULT_SORT_CRITERIA;
}

export type SortDirection = "asc" | "desc";
export const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

export function parseSortDirectionParam(param?: string | null): SortDirection {
  if (param === "asc" || param === "desc") {
    return param;
  }

  return DEFAULT_SORT_DIRECTION;
}
