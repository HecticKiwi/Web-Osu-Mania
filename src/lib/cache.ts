type Cache = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, ttlSeconds: number) => Promise<void>;
};

const nodeCaches = new Map<
  string,
  Map<string, { value: string; expiresAt: number }>
>();

function getNodeCache(namespace: string) {
  let cache = nodeCaches.get(namespace);
  if (!cache) {
    cache = new Map();
    nodeCaches.set(namespace, cache);
  }
  return cache;
}

function isCloudflare() {
  return !!process.env.CF_PAGES;
}

export async function getCache(namespace: string): Promise<Cache> {
  // --- Cloudflare KV ---
  if (isCloudflare()) {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const kv = (getCloudflareContext().env as any)[namespace];

    if (!kv) {
      throw new Error(`Cloudflare KV binding "${namespace}" not found`);
    }

    return {
      async get(key) {
        return await kv.get(key);
      },
      async put(key, value, ttlSeconds) {
        await kv.put(key, value, { expirationTtl: ttlSeconds });
      },
    };
  }

  // --- Node / local dev ---
  const cache = getNodeCache(namespace);

  return {
    async get(key) {
      const entry = cache.get(key);
      if (!entry) return null;

      if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
      }

      return entry.value;
    },
    async put(key, value, ttlSeconds) {
      cache.set(key, {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
    },
  };
}
