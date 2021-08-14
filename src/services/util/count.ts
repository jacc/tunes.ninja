import {prisma***REMOVED*** from "../prisma";
import {wrapRedis***REMOVED*** from "../redis";

const TEN_MINUTES_IN_SECONDS = 600;

export function countSearches(): Promise<number> {
  return wrapRedis(
    "tickers:count",
    async () => {
      const stats = await prisma.stats.findFirst({***REMOVED***
      return stats?.searches || 0;
  ***REMOVED***,
    TEN_MINUTES_IN_SECONDS
  );
***REMOVED***

export function countProfiles(): Promise<number> {
  return wrapRedis(
    "profiles:count",
    async () => {
      const stats = await prisma.user.findMany({***REMOVED***
      return stats.length || 0;
  ***REMOVED***,
    TEN_MINUTES_IN_SECONDS
  );
***REMOVED***
