import {prisma} from "../prisma";
import {wrapRedis} from "../redis";

const TEN_MINUTES_IN_SECONDS = 600;

export function countSearches(): Promise<number> {
  return wrapRedis(
    "tickers:count",
    async () => {
      const stats = await prisma.stats.findFirst({});
      return stats?.searches || 0;
    },
    TEN_MINUTES_IN_SECONDS
  );
}

export function countProfiles(): Promise<number> {
  return wrapRedis(
    "profiles:count",
    async () => {
      const stats = await prisma.user.findMany({});
      return stats.length || 0;
    },
    TEN_MINUTES_IN_SECONDS
  );
}
