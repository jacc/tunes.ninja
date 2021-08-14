import {ChatCommand***REMOVED*** from "../../types/command";

export const support: ChatCommand = {
  name: "support",
  description: "Get a link to the support server.",
  inhibitors: [],
  type: "CHAT_INPUT",

  async run(interaction) {
    if (!interaction.isCommand()) return;
    await interaction.reply({content: "https://tunes.ninja/support", ephemeral: true***REMOVED***
***REMOVED***,
***REMOVED***;
