import {voted***REMOVED*** from "../../inhibitors/voted";
import {JoshAPI***REMOVED*** from "../../services/api/josh";
import {InteractionOptions***REMOVED*** from "../../services/util/interactionOptions";
import {ChatCommand***REMOVED*** from "../../types/command";

export const api: ChatCommand = {
  name: "api",
  description: "Interact with tunes.ninja's API.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "link",
      description: "Link your Spotify account to the tunes.ninja playlist API.",
      type: "SUB_COMMAND",
  ***REMOVED***,
    {
      name: "unlink",
      description: "Unlink your Spotify account to the tunes.ninja playlist API",
      type: "SUB_COMMAND",
  ***REMOVED***,
  ],
  inhibitors: [voted],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
***REMOVED***

    if (options.subCommandName === "link") {
      const request = await JoshAPI.link(
        interaction.guild!.id,
        interaction.channel!.id,
        interaction.user.id
  ***REMOVED***

      await interaction.reply({
        content: `[Click here to link your Spotify account to tunes.ninja!](${request***REMOVED***)`,
        ephemeral: true,
      ***REMOVED***
  ***REMOVED*** else if (options.subCommandName === "unlink") {
      const request = await JoshAPI.unlink(interaction.user.id);

      if (!request) throw new Error("Internal error, do `/support");
      await interaction.reply({
        content: `If you had an account, it will be deleted!`,
        ephemeral: true,
      ***REMOVED***
  ***REMOVED***
***REMOVED***,
***REMOVED***;
