export type Stars = {
  min: number | null;
  max: number | null;
};

export const DEFAULT_STARS: Stars = {
  min: null,
  max: null,
};

export function parseStarsParam(param?: string | null): Stars {
  if (param) {
    const [min, max] = param
      .split("-")
      .map((value) => (value === "null" ? null : Number(value)));
    return { min, max };
  }

  return DEFAULT_STARS;
}
