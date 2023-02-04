import { Message } from "discord.js";
import { z } from "zod";
import { trpc } from "../services/trpc";

const linkSchema = z.string().refine((x) => {
  return (
    x.includes("open.spotify.com/track") ||
    x.includes("open.spotify.com/album") ||
    x.includes("music.apple.com") ||
    x.includes("soundcloud.com")
  );
}, "Invalid URL - Only Spotify, Apple Music, and SoundCloud are supported");

export async function handleMessage(message: Message): Promise<void> {
  if (message.author.bot) return;
  if (!message.guild) return;

  const guild = await trpc.guild.heartbeat.query({
    id: message.guild.id,
  });

  console.log(guild);

  if (!guild.enabled) return;

  try {
    const link = linkSchema.parse(message.content);
    const query = await trpc.song.links.query({ link });
    await message.reply(query.title);
  } catch (error) {}
}
