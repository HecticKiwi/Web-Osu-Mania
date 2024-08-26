export type Stars = {
  min: number;
  max: number;
};

export const DEFAULT_STARS: Stars = {
  min: 0,
  max: 10,
};

export function parseStarsParam(param?: string | null): Stars {
  if (param) {
    const [min, max] = param.split("-").map((value) => Number(value));
    return { min, max };
  }

  return DEFAULT_STARS;
}
