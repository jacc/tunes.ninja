import IORedis from "ioredis";
import { env } from "../../env";

export const redis = new IORedis(env.REDIS_URL, {
  lazyConnect: true,
});

export type Mirror<T extends string = string> = {
  [Key in T]: Key;
};

export type Primitive = string | number | boolean | null | undefined;

/**
 * Checks if a value exists in an array in a type safe manner
 * @param value Value to check
 * @param arr An array of possible matches
 * @returns A boolean indicating if a passed value is one of the items in the array
 */
export function is<V extends Primitive, Arr extends readonly [V, ...V[]]>(
  value: unknown,
  arr: Arr
): value is Arr[number] {
  return arr.includes(value as V);
}

export function enumerate<T extends string>(values: Mirror<T>) {
  return Object.values(values) as [T, ...T[]];
}

export function ensureAnyError<T>(
  value: T
): T extends Error ? T : WrappedError {
  type R = T extends Error ? T : WrappedError;

  if (value instanceof Error) {
    return value as R;
  }

  return new WrappedError(value) as R;
}

export function keyof<T>(value: T) {
  return Object.keys(value) as Array<keyof T>;
}

export class WrappedError extends Error {
  constructor(public readonly data: unknown) {
    super("Something was thrown, but it was not an Error");
  }
}

export const CACHE_ERROR = Symbol("errored");

export async function wrapRedis<T>(
  key: string,
  fn: () => Promise<T>,
  seconds = 60
) {
  return cache<T>({
    refetch: fn,
    get: async () => {
      const value = await redis.get(key);

      if (!value) {
        throw new Error("Cache miss");
      }

      return JSON.parse(value) as T;
    },
    set: async (value) => {
      await redis.set(key, JSON.stringify(value), "ex", seconds);
    },
  });
}

export interface Cache<T> {
  get(): Promise<T>;
  set(value: T): Promise<void>;
  refetch(): Promise<T>;
}

export async function cache<T>(methods: Cache<T>) {
  const cached = await methods.get().catch(() => CACHE_ERROR);

  if (cached !== CACHE_ERROR) {
    return cached as T;
  }

  const recent = await methods.refetch();

  if (recent) {
    await methods.set(recent);
  }

  return recent;
}

export function createCache<T>(methods: Cache<T>) {
  return async () => cache(methods);
}

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends Record<string, unknown>
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
