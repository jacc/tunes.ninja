import { UnknownAlbum, UnknownSong } from "../../structs/exceptions";
import SpotifyWebApi from "spotify-web-api-node";
import { wrapRedis } from "../redis";

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12;

const spotifyApi = new SpotifyWebApi({
  clientId: `${process.env.SPOTIFY_ID}`,
  clientSecret: `${process.env.SPOTIFY_SECRET}`,
});

export class SpotifyAPI {
  private static async getAuthorization(): Promise<string> {
    let expiry;
    return wrapRedis(
      "spotify:auth",
      async () => {
        const { access_token, expires_in } = (
          await spotifyApi.clientCredentialsGrant()
        ).body;
        expiry = expires_in;
        return access_token as string;
      },
      expiry
    );
  }

  public static async searchSong(query: string): Promise<string> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    const search = await spotifyApi.searchTracks(query, { limit: 1 });

    if (!search.body.tracks?.items.length) {
      throw new UnknownSong();
    }

    return search.body.tracks.items[0].uri;
  }

  public static async searchArtist(
    query: string
  ): Promise<SpotifyApi.ArtistObjectFull> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    console.log(query);
    const search = await spotifyApi.searchArtists(query, { limit: 1 });

    if (!search.body.artists?.items.length) {
      throw new UnknownSong();
    }

    return search.body.artists.items[0];
  }

  public static async analyzeAudio(
    query: string
  ): Promise<SpotifyApi.AudioAnalysisResponse> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    const search = await spotifyApi.getAudioFeaturesForTrack(query);

    return search.body;
  }

  public static async searchSongs(query: string): Promise<any> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    const search = await spotifyApi.searchTracks(query, { limit: 24 });

    return search.body.tracks;
  }

  public static async searchArtists(query: string): Promise<any> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    const search = await spotifyApi.searchArtists(query, { limit: 24 });

    return search.body.artists;
  }

  public static async searchAlbums(query: string): Promise<any> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    const search = await spotifyApi.searchAlbums(query, { limit: 24 });

    return search.body.albums;
  }

  public static async topSongs(): Promise<any> {
    return wrapRedis(
      "spotify:topSongs",
      async () => {
        const auth = await this.getAuthorization();
        await spotifyApi.setAccessToken(auth);
        const search = await spotifyApi.getPlaylistTracks(
          "37i9dQZEVXbMDoHDwVN2tF"
        );
        return search.body;
      },
      TWELVE_HOURS_IN_SECONDS
    );
  }

  public static async searchSongMetaData(query: string): Promise<{
    artist: string;
    title: string;
    thumbnail: string;
    uri: string;
  }> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    const search = await spotifyApi.searchTracks(query, { limit: 1 });

    if (!search.body.tracks?.items.length) {
      throw new UnknownSong();
    }

    return {
      artist: search.body.tracks.items[0].artists[0].name,
      title: search.body.tracks.items[0].name,
      thumbnail: search.body.tracks.items[0].album.images[0].url,
      uri: search.body.tracks.items[0].uri,
    };
  }

  public static async searchAlbum(query: string): Promise<string> {
    const auth = await this.getAuthorization();
    await spotifyApi.setAccessToken(auth);
    const search = await spotifyApi.searchAlbums(query, { limit: 1 });

    if (!search.body.albums?.items.length) {
      throw new UnknownAlbum();
    }
    return search.body.albums.items[0].uri;
  }
}
