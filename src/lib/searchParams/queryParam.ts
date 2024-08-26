export const DEFAULT_QUERY = "";

export function parseQueryParam(param?: string | null): string {
  return param || DEFAULT_QUERY;
}
