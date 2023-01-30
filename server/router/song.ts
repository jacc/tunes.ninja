import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { env } from "../../env";
import axios from "axios";
import urlcat from "urlcat";

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
      const request = await axios.get(
        urlcat(`https://api.song.link/v1-alpha.1/links?url=:title&key=:key`, {
          title: req.input.title,
          key: env.SONG_LINK_API_KEY,
        })
      );

      console.log(request);
    }),
});
