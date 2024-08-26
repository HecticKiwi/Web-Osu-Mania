export const DEFAULT_KEYS: string[] = [];

export function parseKeysParam(param?: string | null): string[] {
  return param?.split(",") || DEFAULT_KEYS;
}
