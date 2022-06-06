import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "@discordjs/builders";
import {
  ActionRow,
  APIInteractionGuildMember,
  ButtonStyle,
  CommandInteraction,
  ContextMenuCommandInteraction,
  GuildMember,
  Message,
  MessageContextMenuCommandInteraction,
  User,
} from "discord.js";
import { Service } from "ts-node";
import { prisma } from "./prisma";
import { Guild, ReplyStyle, Services } from "../../prisma-client-js";
import { SongsApi } from "./api/links";
import { wrapRedis } from "./redis";

export async function dispatchReply(
  message: Message | CommandInteraction | ContextMenuCommandInteraction,
  linkToSong: string,
  settings: Guild,
  forceDescriptive?: boolean,
  plays?: number
): Promise<void> {
  let author: User | GuildMember | APIInteractionGuildMember | null;

  if ("author" in message) {
    author = message.author;
  } else {
    if (!message.deferred) {
      await message.deferReply();
    }
    author = message.member;
  }

  console.time("getting song");
  const song = await SongsApi.getLinks(linkToSong);
  console.log(song);
  if (!song.links) return;
  console.timeEnd("getting song");

  const servicesSettings = settings.returnServices;
  const filteredServices = Object.keys(song.links).filter((service) =>
    servicesSettings.includes(songMapping[service] as Services)
  );

  let group;
  if (filteredServices.length > 5) {
    group = chunk(
      Object.entries(song.links).filter((link) =>
        filteredServices.includes(link[0])
      ),
      3
    );
  } else {
    group = chunk(
      Object.entries(song.links).filter((link) =>
        filteredServices.includes(link[0])
      ),
      5
    );
  }

  console.time("building embed");
  const rows = group.map((chunks) => {
    const buttonRow = new ActionRowBuilder<ButtonBuilder>();
    chunks.map((chunk) => {
      if (!chunk[1]) return;
      return buttonRow.addComponents([
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(chunk[1] as string)
          .setEmoji({ id: PLATFORM_EMOJI[chunk[0]] }),
      ]);
    });
    return buttonRow;
  });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${song.title} by ${song.artist}`,
      iconURL: `${song.thumbnail}`,
    })
    .setColor(0x2f3136);
  console.timeEnd("building embed");

  console.time("sending reply");
  await message.reply({
    embeds:
      settings.replyStyle === ReplyStyle.DESCRIPTIVE || forceDescriptive
        ? [embed]
        : [],
    components: rows,
  });
  console.timeEnd("sending reply");
}

const filterMapping: Record<string, string> = {
  [Services.APPLEMUSIC]: "apple_music",
  [Services.SPOTIFY]: "spotify",
  [Services.SOUNDCLOUD]: "soundcloud",
  [Services.TIDAL]: "tidal",
  [Services.YOUTUBE]: "youtube",
  [Services.YOUTUBE_MUSIC]: "youtube_music",
};

const songMapping: Record<string, string> = {
  apple_music: Services.APPLEMUSIC,
  spotify: Services.SPOTIFY,
  soundcloud: Services.SOUNDCLOUD,
  tidal: Services.TIDAL,
  youtube: Services.YOUTUBE,
  youtube_music: Services.YOUTUBE_MUSIC,
};

export const PLATFORM_EMOJI: Record<string, string> = {
  apple_music: "847868738870968380",
  "apple-music": "847868738870968380",
  appleMusic: "847868738870968380",
  soundcloud: "847868739257106453",
  spotify: "847868739298131998",
  tidal: "847868738254012467",
  youtube: "847883855344042044",
  youtube_music: "847868739172827156",
};

function chunk<T>(array: T[], size: number): T[][] {
  const results: T[][] = [];
  while (array.length) {
    const spliced = array.splice(0, size);
    results.push(spliced);
  }
  return results;
}
