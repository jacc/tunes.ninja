import { CommandInteraction, Message, User } from "discord.js";
import fetch from "node-fetch";
import { JoshLink } from "../../types/josh";
import { prisma } from "../prisma";

export class JoshAPI {
  public static async link(
    server: string,
    channel: string,
    user: string
  ): Promise<string> {
    const response = await fetch(`${process.env.JOSH_BASE}login/user/spotify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.JOSH_AUTH}`,
      },
      body: JSON.stringify({
        platform: "spotify",
        discordChannelID: channel.toString(),
        discordServerID: server.toString(),
        discordUserID: user.toString(),
      }),
    });

    const body = await response.json();
    if (response.status !== 200) {
      if (!body.detail) throw new Error(body.reason);
      if (body.detail) throw new Error(body.detail.reason);
    }
    return body.url;
  }

  // TODO: fix unlink
  public static async unlink(user: string): Promise<boolean> {
    const response = await fetch(`${process.env.JOSH_BASE}unlink/spotify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.JOSH_AUTH}`,
      },
      body: JSON.stringify({
        discordUserID: user.toString(),
      }),
    });

    const body = await response.json();

    if (response.status !== 200) {
      if (!body.detail) throw new Error(body.reason);
      if (body.detail) throw new Error(body.detail.reason);
    }
    return true;
  }

  public static async play(user: string, song: string): Promise<string> {
    const response = await fetch(
      `${process.env.JOSH_BASE}spotify/user/${user}/action/play/song`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          spotifyTrackID: song.toString(),
        }),
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
    }
    return body;
  }

  public static async playlist(
    server: string,
    channel: string,
    user: string
  ): Promise<JoshLink> {
    const response = await fetch(
      `${process.env.JOSH_BASE}link/playlist/creation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
        body: JSON.stringify({
          platform: "spotify",
          discordChannelID: channel.toString(),
          discordServerID: server.toString(),
          discordUserID: user.toString(),
        }),
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
    }
    return body;
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public static async delete(channel: string): Promise<any> {
    const response = await fetch(`${process.env.JOSH_BASE}unlink/playlist`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.JOSH_AUTH}`,
      },
      body: JSON.stringify({
        platform: "spotify",
        discordChannelID: channel.toString(),
      }),
    });

    await prisma.joshChannel.delete({
      where: {
        id: channel.toString(),
      },
    });

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
    }
    return body;
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public static async add(
    message: Message | CommandInteraction,
    url: string
  ): Promise<any> {
    let author;
    if (message instanceof Message) {
      author = message.author;
    }
    if (message instanceof CommandInteraction) {
      if (!message.deferred) {
        await message.deferReply();
      }
      author = message.member;
    }

    await fetch(`${process.env.JOSH_BASE}add/new/song/premium`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.JOSH_AUTH}`,
      },
      body: JSON.stringify({
        platform: "spotify",
        discordChannelID: message.channel!.id.toString(),
        discordServerID: message.guild!.id.toString(),
        discordUserID: (author as User).id.toString(),
        url,
      }),
    });

    if (message instanceof Message) {
      await message.react("🎶");
    }
  }

  public static async getPlaylists(user: string): Promise<any> {
    const response = await fetch(
      `${process.env.JOSH_BASE}playlists/${user}?fresh=true`,
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
      throw new Error(body.detail.reason);
    }
    return body;
  }

  public static async addPersonalPlaylist(
    user: string,
    playlist: string,
    song: string
  ): Promise<any> {
    const response = await fetch(
      `${process.env.JOSH_BASE}user/${user}/playlist/${playlist}/add/spotify?song_id=${song}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.JOSH_AUTH}`,
        },
      }
    );

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error(body.detail.reason);
    }
    return body;
  }
}
