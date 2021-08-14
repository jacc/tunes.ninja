import {PrismaClient} from "@prisma/client";
import {User} from "discord.js";

export const prisma = new PrismaClient();

export async function incrementSearches(author: User): Promise<void> {
  const stats = await prisma.stats.findFirst({});
  if (!stats) {
    await prisma.stats.create({
      data: {
        searches: 0,
      },
    });

    await prisma.stats.updateMany({
      data: {
        searches: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.stats.updateMany({
      data: {
        searches: {
          increment: 1,
        },
      },
    });

    let userSettings = await prisma.user.findFirst({
      where: {id: author.id},
    });
    if (!userSettings) {
      const id = author.id as string;
      await prisma.user.create({
        data: {id},
      });
    }

    userSettings = await prisma.user.findFirst({
      where: {id: author.id},
    });

    await prisma.user.updateMany({
      where: {
        id: author.id,
      },
      data: {
        searches: {
          increment: 1,
        },
      },
    });
  }
}
