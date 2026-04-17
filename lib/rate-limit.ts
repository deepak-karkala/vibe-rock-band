import { LRUCache } from "lru-cache";

type Entry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new LRUCache<string, Entry>({
  max: 500,
  ttl: 60_000,
});

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "local"
  );
}

export function enforceRateLimit(ip: string, bucket: string, maxRequests = 10) {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + 60_000 });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return { allowed: true, remaining: maxRequests - current.count };
}
