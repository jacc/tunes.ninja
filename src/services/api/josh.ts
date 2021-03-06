/*
To anyone who may view this file before I get the chance to rewrite it,
this is an extremely disgusting way to handle the interactions
between the tunes.ninja API and the front end. It's also not typed
at all and just returns Promise<any>, which entirely defeats the point
of TypeScript! The functions are also super poorly named but it Works™

Please don't be like me. I'll eventually rewrite the class with an API
handler and whatever else but this is what I will make do with for now.

Thanks for not roasting me <3 (and if you see this tweet me @laf0nd!)

Love,
Jack, 8/22/21 at 10:22pm
 */

import { User } from "discord.js";
import fetch from "node-fetch";
import { isDev } from "../../constants";
import { JoshLink } from "../../types/josh";

export class JoshAPI {
  public static async linkUser(
    server: string,
    channel: string,
    user: string,
    platform: string
  ): Promise<string> {
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }login/user/${platform}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          platform: platform.toString(),
          discordUserID: user.toString(),
        }),
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.reason);
    }
    return body.url;
  }

  public static async getUser(user: string): Promise<any> {
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }linked/services/user/${user}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.reason);
    }
    return body;
  }

  public static async unlinkUser(
    user: string,
    platform: string
  ): Promise<boolean> {
    const response = await fetch(
      `${isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE}unlink`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          platform: platform.toString(),
          discordUserID: user.toString(),
        }),
      }
    );

    const body = await response.json();

    if (response.status !== 200) {
      throw new Error(body.reason);
    }
    return true;
  }

  public static async playOnSpotify(
    user: string,
    song: string
  ): Promise<string> {
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }spotify/play/song/now`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          trackID: song.toString(),
          discordUserID: user.toString()
        }),
      }
    );

    const body = await response.json();
    console.log(body)
    if (response.status !== 200) {
      if (body.code === "1993") throw new Error("Your Spotify credentials are missing! Do `/api link` to set this up.")
      throw new Error(body.reason);
    }
    return body;
  }

  public static async queueOnSpotify(
      user: string,
      song: string
  ): Promise<string> {
    const response = await fetch(
        `${
            isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
        }spotify/play/song/queue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.JOSH_AUTH}`,
          },
          body: JSON.stringify({
            trackID: song.toString(),
            discordUserID: user.toString()
          }),
        }
    );

    const body = await response.json();
    if (response.status !== 200) {
      if (body.code === "1993") throw new Error("Your Spotify credentials are missing! Do `/api link` to set this up.")
      throw new Error(body.reason);
    }
    return body;
  }

  public static async getLinkedPlaylists(channel: string): Promise<any> {
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }linked/playlists/channels/${channel}?getPlaylistName=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
      }
    );
    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.reason);
    }
    return body;
  }

  public static async createPlaylist(
    user: User,
    platform: string
  ): Promise<JoshLink> {
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }${platform}/create/playlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          playlistName: `${user.username}'s synced playlist`,
          discordUserId: user.id.toString(),
        }),
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.reason);
    }
    return body;
  }

  public static async getUserPlaylists(
    user: string,
    platform: string
  ): Promise<any> {
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }${platform}/users/playlists/${user}?fresh=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
      }
    );

    const body = await response.json();

    if (response.status !== 200) {
      throw new Error(body.reason);
    }
    return body;
  }

  public static async addSongToPlaylist(
    user: string,
    playlist: string,
    song: string,
    platform: string
  ): Promise<any> {
    console.log(user, playlist, song, platform);
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }${platform}/playlist/add/song`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          playlistID: playlist.toString(),
          discordUserID: user.toString(),
          trackID: song.toString(),
        }),
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail);
    }
    return body;
  }

  public static async syncPlaylist(
    server: string,
    channel: string,
    user: string,
    platform: string,
    playlistID: string
  ): Promise<any> {
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }${platform}/link/playlist/user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          playlistID,
          discordUserID: user.toString(),
          discordChannelID: channel.toString(),
          discordServerID: server.toString(),
        }),
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail);
    }
    return body;
  }

  public static async unsyncPlaylist(
    channel: string,
    platform: string
  ): Promise<any> {
    const response = await fetch(
      `${
        isDev ? process.env.JOSH_DEV_BASE : process.env.JOSH_BASE
      }${platform}/unlink/playlist`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          discordChannelID: channel.toString(),
        }),
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error("No playlist is synced with this channel.");
    }
    return body;
  }
}
