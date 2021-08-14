import {UnknownLastFM} from "../../structs/exceptions";
import fetch from "node-fetch";

export class LastFMAPI {
  public static async search(user: string): Promise<{song: string; artist: string; np: boolean}> {
    const search = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${process.env.LASTFM_API}&format=json&limit=1`
    );
    const response = await search.json();

    if (!search.ok) {
      throw new UnknownLastFM();
    }

    if (response["recenttracks"]["track"].length === 0) {
      throw new UnknownLastFM();
    }

    return {
      song: response["recenttracks"]["track"][0]["name"],
      artist: response["recenttracks"]["track"][0]["artist"]["#text"],
      np:
        "@attr" in response["recenttracks"]["track"][0]
          ? response["recenttracks"]["track"][0]["@attr"]["nowplaying"]
          : null,
    };
  }
}
