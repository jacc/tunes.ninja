import { ChatCommand } from "../../types/command";

export const source: ChatCommand = {
  name: "source",
  description: "Get a link to tunes.ninja's source code!.",
  type: "CHAT_INPUT",
  inhibitors: [],
  async run(interaction) {
    if (!interaction.isCommand()) return;
    await interaction.reply({
      content:
        "tunes.ninja is fully open source and always looking for contributors! You can find the source code here: https://tunes.ninja/github",
      ephemeral: true,
    });
  },
};
