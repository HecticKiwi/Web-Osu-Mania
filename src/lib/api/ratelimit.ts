type RateLimitOptions = {
  limit: number;    // Number of allowed requests
  windowMs: number; // Window in ms (e.g. 60000 for 1 min)
  // So (60, 60000) means 60 requests per minute
};

const ipCache = new Map<string, number[]>();

export function rateLimit(
  req: Request | { headers: any },
  { limit, windowMs }: RateLimitOptions
): boolean {
  const now = Date.now();
  let ip =
    req.headers.get?.("x-forwarded-for")?.split(",")[0] ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    "local";
  if (!ip) ip = "unknown";

  const timestamps = (ipCache.get(ip) || []).filter(ts => now - ts < windowMs);
  timestamps.push(now);
  ipCache.set(ip, timestamps);

  return timestamps.length <= limit;
}
