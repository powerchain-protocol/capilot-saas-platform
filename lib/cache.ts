type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type GlobalCache = typeof globalThis & { __pcCache?: Map<string, CacheEntry<unknown>> };
const globalCache = globalThis as GlobalCache;
const store = globalCache.__pcCache ?? new Map<string, CacheEntry<unknown>>();
if (!globalCache.__pcCache) globalCache.__pcCache = store;

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number) {
  store.set(key, { value, expiresAt: Date.now() + Math.max(0, ttlMs) });
  return value;
}

export async function cacheGetOrSet<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const cached = cacheGet<T>(key);
  if (cached !== null) return cached;
  const value = await loader();
  return cacheSet(key, value, ttlMs);
}

export function cacheDelete(key: string) {
  store.delete(key);
}

export function cachePrune() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}
