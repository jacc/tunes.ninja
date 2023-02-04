import { z } from "zod";
import { prisma } from "../../discord/services/prisma";
import { publicProcedure, router } from "../trpc";

export const guildRouter = router({
  heartbeat: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async (req) => {
      const guild = await prisma.guild.upsert({
        where: { id: req.input.id },
        update: {},
        create: {
          id: req.input.id,
        },
      });

      return guild;
    }),
});
