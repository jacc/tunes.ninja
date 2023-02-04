import type { ChatCommand } from "../../types/command";
import type { CommandInteraction } from "discord.js";
import { ApplicationCommandType } from "discord.js";

export const ping: ChatCommand = {
  name: "ping",
  description: "Checks that the bot is online. hi twitch",
  type: ApplicationCommandType.ChatInput,
  inhibitors: [],
  async run(interaction: CommandInteraction) {
    await interaction.reply({ content: "Pong! hoe 2", ephemeral: true });
  },
};
