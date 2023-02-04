import { Message } from "discord.js";
import { z } from "zod";
import { trpc } from "../services/trpc";
import { handleLinks } from "./song";

const linkSchema = z.string().refine((x) => {
  return (
    x.includes("open.spotify.com/track") ||
    x.includes("open.spotify.com/album") ||
    x.includes("music.apple.com") ||
    x.includes("soundcloud.com")
  );
}, "Invalid URL - Only Spotify, Apple Music, and SoundCloud are supported");

export async function handleMessage(message: Message): Promise<void> {
  if (message.author.bot || !message.guild) return;

  const guild = await trpc.guild.heartbeat.query({
    id: message.guild.id,
  });
  if (!guild.enabled) return;

  const link = linkSchema.safeParse(message.content);
  if (!link.success) return;

  const matches = link.data.match(/\bhttps?:\/\/\S+/gi);
  if (!matches) return;

  matches.map(async (match) => {
    switch (true) {
      case match.includes("open.spotify.com/track"):
        if (!guild.replyToSpotify) return;
        await handleLinks(message, match, guild.replyStyle);
        break;
      case match.includes("open.spotify.com/album"):
        if (!guild.replyToSpotify) return;
        await handleLinks(message, match, guild.replyStyle);
        break;
      case match.includes("music.apple.com"):
        if (!guild.replyToAppleMusic) return;
        await handleLinks(message, match, guild.replyStyle);
        break;
      case match.includes("soundcloud.com"):
        if (!guild.replyToSoundcloud) return;
        await handleLinks(message, match, guild.replyStyle);
        break;
    }
  });
}
