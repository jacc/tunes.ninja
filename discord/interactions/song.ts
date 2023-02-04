import { REPLY_STYLE } from "@prisma/client";
import {
  ActionRowBuilder,
  APIInteractionGuildMember,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ContextMenuCommandInteraction,
  GuildMember,
  Message,
  User,
} from "discord.js";
import { trpc } from "../services/trpc";
import { PLATFORM_EMOJI } from "../types/emoji";

export async function handleLinks(
  message: Message | CommandInteraction | ContextMenuCommandInteraction,
  link: string,
  replyStyle: REPLY_STYLE,
  plays?: number,
  lastfm?: string
): Promise<void> {
  let author: User | GuildMember | APIInteractionGuildMember | null;

  const song = await trpc.song.links.query({
    link,
  });

  switch (replyStyle) {
    case REPLY_STYLE.EMBED:
      console.log("ok");
    case REPLY_STYLE.MINIMAL:
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setEmoji(PLATFORM_EMOJI.spotify)
          .setURL(
            "https://open.spotify.com/track/3RWjhGoGLeJlrPlMWJyHJf?si=3de2d20949a4443c"
          )
          .setStyle(ButtonStyle.Link)
      );

      await message.reply({ components: [row] });
  }
}
