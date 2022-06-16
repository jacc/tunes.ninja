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
