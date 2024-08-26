export const GENRES = [
  "Any",
  "Unspecified",
  "Video Game",
  "Anime",
  "Rock",
  "Pop",
  "Other",
  "Novelty",
  "Hip Hop",
  "Electronic",
  "Metal",
  "Classical",
  "Folk",
  "Jazz",
] as const;
export type Genre = (typeof GENRES)[number];

export const DEFAULT_GENRE: Genre = "Any";

export function parseGenreParam(param?: string | null): Genre {
  if (param && GENRES.includes(param as Genre)) {
    return param as Genre;
  }

  return DEFAULT_GENRE;
}
