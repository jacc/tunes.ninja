import { Guild as PrismaGuild, Services } from "../../../prisma-client-js";
import { prisma } from "../prisma";
import { wrapRedis } from "../redis";

export async function checkLinkPermission(
  link: string,
  settings: PrismaGuild
): Promise<boolean> {
  if (link.includes("spotify")) {
    return settings.replyToSpotify;
  } else if (link.includes("apple")) {
    return settings.replyToAppleMusic;
  } else if (link.includes("soundcloud")) {
    return settings.replyToSoundcloud;
  } else {
    return false;
  }
}

export async function returnGuildSettings(id: string): Promise<any> {
  return wrapRedis(
    `settings:${id}`,
    () =>
      prisma.guild.upsert({
        where: {
          id,
        },
        update: {},
        create: {
          id,
          returnServices: [
            Services.SPOTIFY,
            Services.APPLEMUSIC,
            Services.SOUNDCLOUD,
          ],
        },
      }),
    6000
  );
}

export async function returnUserSettings(id: string): Promise<any> {
  return wrapRedis(
    `settings:user:${id}`,
    () =>
      prisma.user.upsert({
        where: {
          id,
        },
        update: {},
        create: {
          id,
        },
      }),
    6000
  );
}

export async function incrementUserSearches(id: string): Promise<boolean> {
  const update = await prisma.user.upsert({
    where: { id },
    update: {
      searches: { increment: 1 },
    },
    create: { id, searches: 1 },
  });

  return true; // TODO: wtf lol this doesn't return true always
}
