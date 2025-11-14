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

export const GENRE_ID_MAP = {
  Any: undefined,
  Unspecified: 1,
  "Video Game": 2,
  Anime: 3,
  Rock: 4,
  Pop: 5,
  Other: 6,
  Novelty: 7,
  "Hip Hop": 9,
  Electronic: 10,
  Metal: 11,
  Classical: 12,
  Folk: 13,
  Jazz: 14,
} as const satisfies Record<Genre, number | undefined>;

export function parseGenreParam(param?: string | null): Genre {
  if (param && GENRES.includes(param as Genre)) {
    return param as Genre;
  }

  return DEFAULT_GENRE;
}
