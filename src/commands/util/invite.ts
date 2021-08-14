import {ChatCommand***REMOVED*** from "../../types/command";

export const invite: ChatCommand = {
  name: "invite",
  description: "Get an invite link to the bot.",
  type: "CHAT_INPUT",
  inhibitors: [],
  async run(interaction) {
    if (!interaction.isCommand()) return;
    await interaction.reply({content: "https://tunes.ninja/invite", ephemeral: true***REMOVED***
***REMOVED***,
***REMOVED***;
