export const LANGUAGES = [
  "Any",
  "English",
  "Chinese",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Korean",
  "Spanish",
  "Swedish",
  "Russian",
  "Polish",
  "Instrumental",
  "Unspecified",
  "Other",
] as const;
export type Language = (typeof LANGUAGES)[number];

// Idk what's up with these random indexes, I just copied the osu site's numbers
export const LANGUAGE_INDEXES = new Map<Language, number | undefined>([
  ["Any", undefined],
  ["English", 2],
  ["Chinese", 4],
  ["French", 7],
  ["German", 8],
  ["Italian", 11],
  ["Japanese", 3],
  ["Korean", 6],
  ["Spanish", 10],
  ["Swedish", 9],
  ["Russian", 12],
  ["Polish", 13],
  ["Instrumental", 5],
  ["Unspecified", 1],
  ["Other", 14],
]);

export const DEFAULT_LANGUAGE: Language = "Any";

export function parseLanguageParam(param?: string | null): Language {
  if (param && LANGUAGES.includes(param as Language)) {
    return param as Language;
  }

  return DEFAULT_LANGUAGE;
}
