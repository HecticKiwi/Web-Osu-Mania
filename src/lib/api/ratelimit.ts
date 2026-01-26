type RateLimitOptions = {
  limit: number; // Number of allowed requests
  windowMs: number; // Window in ms (e.g. 60000 for 1 min)
  // So (60, 60000) means 60 requests per minute
};

const ipCache = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const trustCf = process.env.TRUST_CF_CONNECTING_IP === "false";

  const ip =
    (trustCf ? req.headers.get("cf-connecting-ip") : "") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip");

  if (!ip) {
    throw new Error("Unable to determine client IP for rate limiting.");
  }

  return ip;
}

export function rateLimit(
  req: Request,
  { limit, windowMs }: RateLimitOptions = {
    limit: 25,
    windowMs: 60000, // 1 minute
  },
): boolean {
  const now = Date.now();
  const ip = getClientIp(req);

  const timestamps = (ipCache.get(ip) || []).filter(
    (ts) => now - ts < windowMs,
  );
  timestamps.push(now);
  ipCache.set(ip, timestamps);

  const allowed = timestamps.length <= limit;

  if (!allowed) {
    console.warn(
      `[RateLimit] Limit exceeded: IP=${ip}, Time=${new Date(now).toISOString()}, Count=${timestamps.length}/${limit}`,
    );
  }

  return allowed;
}
