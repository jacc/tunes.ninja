import IORedis from "ioredis";

export const redis = new IORedis(process.env.REDIS_URL, {
  lazyConnect: true,
});

/**
 * @param key The key for redis
 * @param fn The function to return a resource. Can be a promise. The result must be JSON Stringifiable (no circular references)
 * @param seconds The TTL for this resources in seconds. Defaults to 60s
 */
export async function wrapRedis<T>(
  key: string,
  fn: () => Promise<T> | T,
  seconds = 60
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const recent = await fn();

  if (recent) {
    await redis.set(
      key,
      JSON.stringify(recent, (_, v) =>
        typeof v === "bigint" ? `${v}n` : v
      ).replace(/"(-?\d+)n"/g, (_, a) => a),
      "ex",
      seconds
    );
  }

  return recent;
}
