import {UnknownSong} from "../../structs/exceptions";
import SpotifyWebApi from "spotify-web-api-node";
import {wrapRedis} from "../redis";

const spotifyApi = new SpotifyWebApi({
  clientId: "db63b20b5fd544409041de5f7d047806",
  clientSecret: "d5a9abe8d06847fca9941d94cb1b21ef",
});

export class SpotifyAPI {
  private static async getAuthorization(): Promise<string> {
    let expiry;
    return wrapRedis(
      "spotify:auth",
      async () => {
        const {access_token, expires_in} = (await spotifyApi.clientCredentialsGrant()).body;
        expiry = expires_in;
        return access_token as string;
      },
      expiry
    );
  }

  public static async search(query: string): Promise<string> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    const search = await spotifyApi.searchTracks(query, {limit: 1});
    if (!search.body.tracks?.items.length) {
      throw new UnknownSong();
    }
    return search.body.tracks.items[0].uri;
  }
}
