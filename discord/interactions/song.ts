import {
  APIInteractionGuildMember,
  CommandInteraction,
  ContextMenuCommandInteraction,
  GuildMember,
  Message,
  User,
} from "discord.js";

export async function returnLinks(
  message: Message | CommandInteraction | ContextMenuCommandInteraction,
  link: string,
  plays?: number,
  lastfm?: string
): Promise<void> {
  let author: User | GuildMember | APIInteractionGuildMember | null;

  console.log(message);
}
