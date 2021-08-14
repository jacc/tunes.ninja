import {UnknownLastFM***REMOVED*** from "../../structs/exceptions";
import fetch from "node-fetch";

export class LastFMAPI {
  public static async search(user: string): Promise<{song: string; artist: string; np: boolean***REMOVED***> {
    const search = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user***REMOVED***&api_key=${process.env.LASTFM_API***REMOVED***&format=json&limit=1`
***REMOVED***
    const response = await search.json();

    if (!search.ok) {
      throw new UnknownLastFM();
  ***REMOVED***

    if (response["recenttracks"]["track"].length === 0) {
      throw new UnknownLastFM();
  ***REMOVED***

    return {
      song: response["recenttracks"]["track"][0]["name"],
      artist: response["recenttracks"]["track"][0]["artist"]["#text"],
      np:
        "@attr" in response["recenttracks"]["track"][0]
          ? response["recenttracks"]["track"][0]["@attr"]["nowplaying"]
          : null,
  ***REMOVED***;
***REMOVED***
***REMOVED***
