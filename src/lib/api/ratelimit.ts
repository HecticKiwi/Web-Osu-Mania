type RateLimitOptions = {
  limit: number;    // Number of allowed requests
  windowMs: number; // Window in ms (e.g. 60000 for 1 min)
  // So (60, 60000) means 60 requests per minute
};

const ipCache = new Map<string, number[]>();

function getClientIp(req: Request | { headers: any }): string {
  const trustCf = process.env.TRUST_CF_CONNECTING_IP === "false";

  const headers = req.headers;
  const get = (k: string) =>
    typeof headers.get === "function"
      ? headers.get(k)
      : headers[k] || headers[k.toLowerCase()];

  let ip: string;
  if (trustCf) {
    ip =
      get("cf-connecting-ip") ||
      get("x-forwarded-for")?.split(",")[0]?.trim() ||
      get("x-real-ip") ||
      "unknown";
  } else {
    ip =
      get("x-forwarded-for")?.split(",")[0]?.trim() ||
      get("x-real-ip") ||
      "unknown";
  }

  if (ip === "unknown") {
    throw new Error("Unable to determine client IP for rate limiting.");
  }

  return ip;
}


export function rateLimit(
  req: Request | { headers: any },
  { limit, windowMs }: RateLimitOptions
): boolean {
  const now = Date.now();
  const ip = getClientIp(req);

  const timestamps = (ipCache.get(ip) || []).filter(ts => now - ts < windowMs);
  timestamps.push(now);
  ipCache.set(ip, timestamps);

  const allowed = timestamps.length <= limit;

  if (!allowed) {
    console.warn(
      `[RateLimit] Limit exceeded: IP=${ip}, Time=${new Date(now).toISOString()}, Count=${timestamps.length}/${limit}`
    );
  }

  return allowed;
}
