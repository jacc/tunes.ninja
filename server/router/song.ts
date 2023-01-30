import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { env } from "../../env";
import axios from "axios";
import urlcat from "urlcat";

export const songRouter = router({
  links: publicProcedure
    .input(
      z.object({
        link: z.string().refine((x) => {
          return (
            x.includes("open.spotify.com/track") ||
            x.includes("open.spotify.com/album") ||
            x.includes("music.apple.com") ||
            x.includes("soundcloud.com")
          );
        }, "Invalid URL - Only Spotify, Apple Music, and SoundCloud are supported"),
      })
    )

    .query(async (req) => {
      const request = await axios.get<any>( // TODO: make this not use any.
        urlcat(`https://api.song.link/v1-alpha.1/links?url=:title&key=:key`, {
          title: req.input.link,
          key: env.SONG_LINK_API_KEY,
        })
      );

      const json = await request.data;

      return {
        title: json.entitiesByUniqueId[json.entityUniqueId]?.title || null,
        artist:
          json.entitiesByUniqueId[json.entityUniqueId]?.artistName || null,
        thumbnail:
          json.entitiesByUniqueId[json.entityUniqueId]?.thumbnailUrl || null,
        links: {
          apple_music: json.linksByPlatform.appleMusic?.url || null,
          soundcloud: json.linksByPlatform.soundcloud?.url || null,
          spotify: json.linksByPlatform.spotify?.url || null,
          tidal: json.linksByPlatform.tidal?.url || null,
          youtube: json.linksByPlatform.youtube?.url || null,
          youtube_music: json.linksByPlatform.youtubeMusic?.url || null,
        },
      } as LinksResponse;
    }),
});

interface LinksResponse {
  title: string;
  artist: string;
  thumbnail: string;
  links: {
    apple_music: string;
    soundcloud: string;
    spotify: string;
    tidal: string;
    youtube: string;
    youtube_music: string;
  };
}
