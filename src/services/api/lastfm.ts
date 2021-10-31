import { UnknownLastFM } from "../../structs/exceptions";
import fetch from "node-fetch";

export class LastFMAPI {
  public static async search(
    user: string
  ): Promise<{ song: string; artist: string; np: boolean; plays: number }> {
    const search = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${process.env.LASTFM_API}&format=json&limit=1`
    );
    const response = await search.json();

    const searchUser = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&user=${user}&api_key=${process.env.LASTFM_API}&format=json&&track=${response["recenttracks"]["track"][0]["name"]}&artist=${response["recenttracks"]["track"][0]["artist"]["#text"]}&limit=1`
    );

    const userResponse = await searchUser.json();

    if (!search.ok || !searchUser.ok) {
      throw new UnknownLastFM();
    }

    if (
      response["recenttracks"]["track"].length === 0 ||
      userResponse["track"].length === 0
    ) {
      throw new UnknownLastFM();
    }

    return {
      song: response["recenttracks"]["track"][0]["name"],
      artist: response["recenttracks"]["track"][0]["artist"]["#text"],
      np:
        "@attr" in response["recenttracks"]["track"][0]
          ? response["recenttracks"]["track"][0]["@attr"]["nowplaying"]
          : null,
      plays: userResponse["track"]["userplaycount"],
    };
  }

  public static async artist(artist: string): Promise<any> { // i am not type hinting this fucking object. you can guess, have fun LMFAO
    const search = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${process.env.LASTFM_API}&format=json&limit=1`
    );
    return await search.json();
  }
}
