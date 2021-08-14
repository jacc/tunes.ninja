import {ChatCommand***REMOVED*** from "../../types/command";

export const ping: ChatCommand = {
  name: "ping",
  description: "Checks that the bot is online.",
  type: "CHAT_INPUT",
  inhibitors: [],
  async run(interaction) {
    await interaction.reply({content: ":ninja:", ephemeral: true***REMOVED***
***REMOVED***,
***REMOVED***;
