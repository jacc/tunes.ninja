import {ChatCommand} from "../../types/command";

export const vote: ChatCommand = {
  name: "vote",
  description: "Get a link to vote for the bot on Top.gg!",
  inhibitors: [],
  type: "CHAT_INPUT",

  async run(interaction) {
    if (!interaction.isCommand()) return;
    await interaction.reply({content: "https://tunes.ninja/vote", ephemeral: true});
  },
};
