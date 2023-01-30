import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const songRouter = router({
  links: publicProcedure
    .input(
      z.object({
        title: z.string().refine((x) => {
          return (
            x.includes("open.spotify.com/track") ||
            x.includes("open.spotify.com/album") ||
            x.includes("music.apple.com") ||
            x.includes("soundcloud.com")
          );
        }, ""),
      })
    )
    .query(async (req) => {
      return { title: req.input.title };
    }),
});
