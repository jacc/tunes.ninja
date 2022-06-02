import { Inhibitor } from "../../types/command";
import { guilds } from "../guilds";
import { GuildMember, Permissions } from "discord.js";

export const manageServer: Inhibitor = (interaction) => {
  guilds(interaction);

  if (!interaction.member) {
    throw new Error("You must use this command in a server.");
  }

  const member = interaction.member;

  console.log(member.permissions);
};
