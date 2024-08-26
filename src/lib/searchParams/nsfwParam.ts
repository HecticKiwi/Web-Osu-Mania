export const DEFAULT_NSFW = true;

export function parseNsfwParam(param?: string | null): boolean {
  return param ? param === "true" : DEFAULT_NSFW;
}
