import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
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
import { Guild, Services } from "../../prisma-client-js";
import { SongsApi } from "./api/links";

export async function dispatchReply(
  message: Message | CommandInteraction | ContextMenuCommandInteraction,
  linkToSong: string,
  settings: Guild,
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

  const song = await SongsApi.getLinks(linkToSong);
  if (!song.links) return;

  console.log(song);

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

  const rows = group.map((chunks) => {
    const buttonRow = new ActionRowBuilder<ButtonBuilder>();
    chunks.map((chunk) => {
      return buttonRow.addComponents([
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(chunk[1] as string)
          .setEmoji({ id: PLATFORM_EMOJI[chunk[0]] }),
      ]);
    });
    return buttonRow;
  });

  await message.reply({
    components: rows,
  });
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
