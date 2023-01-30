import { ChatCommand } from "../../types/command";
import {ApplicationCommandType} from "discord.js";

export const ping: ChatCommand = {
  name: "ping",
  description: "Checks that the bot is online.",
  type: ApplicationCommandType.ChatInput,
  inhibitors: [],
  async run(interaction) {
    await interaction.reply({ content: "Pong!", ephemeral: true });
  },
};
