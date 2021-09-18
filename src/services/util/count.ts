import {prisma} from "../prisma";
import {wrapRedis} from "../redis";
import {Client} from "discord.js";
import {Topgg} from "../api/topgg";

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

export function countPlaylists(): Promise<number> {
    return wrapRedis(
        "playlists:count",
        async () => {
            const stats = await prisma.joshChannel.findMany({});
            return stats.length || 0;
        },
        TEN_MINUTES_IN_SECONDS
    );
}

export function countGuilds(client: Client): Promise<number> {
    return wrapRedis(
        "bot:guilds",
        async () => {
            const stats = await client.guilds.cache.size;
            return stats || 0;
        },
        TEN_MINUTES_IN_SECONDS
    );
}

export function countVotes(client: Client): Promise<number> {
    return wrapRedis(
        "bot:votes",
        async () => {
            const votes = await new Topgg(client.user!.id).getVotes();
            return votes.monthlyPoints || 0;
        },
        TEN_MINUTES_IN_SECONDS
    );
}

