import {
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  User,
} from "discord.js";
import { StandardEmbed } from "../structs/standard-embed";
import { DataDog } from "./api/datadog";
import { JoshAPI } from "./api/josh";
import { SongsApi } from "./api/song";
import { incrementSearches, prisma } from "./prisma";

const dd = new DataDog();

export async function returnLinks(
  message: Message | CommandInteraction | ContextMenuInteraction,
  link: string
): Promise<void> {
  let author;

  if ("author" in message) {
    author = message.author;
  } else {
    if (!message.deferred) {
      await message.deferReply();
    }
    author = message.member;
  }

  const song = await SongsApi.getLinks(link);
  if (!song.links) return;

  // TODO: redo this eventually
  let group;
  if (Object.entries(song.links).filter((link) => link[1]).length === 6) {
    group = chunk(
      Object.entries(song.links).filter((link) => link[1]),
      3
    );
  } else {
    group = chunk(
      Object.entries(song.links).filter((link) => link[1]),
      5
    );
  }

  const rows = group.map((chunks) => {
    const row = new MessageActionRow();
    chunks.map((chunk) => {
      return row.addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setURL(chunk[1] as string)
          .setEmoji(PLATFORM_EMOJI[chunk[0]])
      );
    });
    return row;
  });

  const embed = new StandardEmbed(author as User).setAuthor(
    `${song.title} by ${song.artist}`,
    song.thumbnail ? song.thumbnail : ""
  );

  if (Math.floor(Math.random() * 10) == 1) {
    embed.setDescription(
      "*:ninja: [Psst - vote for us on Top.gg! It really helps the developer out, so click this!](https://tunes.ninja/vote)*"
    );
  }

  if (message instanceof Message) {
    await message.reply({ embeds: [embed], components: rows });
  } else {
    await message.editReply({ embeds: [embed], components: rows });
  }

  const channel = await prisma.joshChannel.findUnique({
    where: {
      id: message.channel!.id,
    },
  });

  if (channel) {
    await JoshAPI.add(message, link);
  }
  await incrementSearches(author as User);
  await dd.inc("interactions.song");
}

function chunk<T>(array: T[], size: number): T[][] {
  const results: T[][] = [];
  while (array.length) {
    const spliced = array.splice(0, size);
    results.push(spliced);
  }
  return results;
}

export const PLATFORM_EMOJI: Record<string, string> = {
  apple_music: "<:apple_music:847868738870968380>",
  appleMusic: "<:apple_music:847868738870968380>",
  soundcloud: "<:soundcloud:847868739257106453>",
  spotify: "<:spotify:847868739298131998>",
  tidal: "<:tidal:847868738254012467>",
  youtube: "<:youtube:847883855344042044>",
  youtube_music: "<:youtube_music:847868739172827156>",
};
