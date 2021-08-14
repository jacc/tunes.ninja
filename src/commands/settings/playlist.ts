import {
  Constants,
  GuildMember,
  MessageActionRow,
  MessageButton,
  Permissions,
  User,
***REMOVED*** from "discord.js";
import {botAdmins***REMOVED*** from "../../inhibitors/botAdmins";
import {JoshAPI***REMOVED*** from "../../services/api/josh";
import {prisma***REMOVED*** from "../../services/prisma";
import {InteractionOptions***REMOVED*** from "../../services/util/interactionOptions";
import {StandardEmbed***REMOVED*** from "../../structs/standard-embed";
import {ChatCommand***REMOVED*** from "../../types/command";

export const playlist: ChatCommand = {
  name: "playlist",
  description: "Tunes.ninja playlist API.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "sync",
      description: "Sync Spotify songs sent in this channel to your server's playlist.",
      type: "SUB_COMMAND",
  ***REMOVED***,
    {
      name: "unsync",
      description: "Unsync this channel from the playlist.",
      type: "SUB_COMMAND",
  ***REMOVED***,
  ],
  inhibitors: [botAdmins],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
***REMOVED***

    if (options.subCommandName === "sync") {
      const member = interaction.member as GuildMember;

      const canManageServer = member.permissions.has(Permissions.FLAGS.MANAGE_GUILD);

      if (!canManageServer) {
        throw new Error("You do not have permission to use this command.");
    ***REMOVED***

      const request = await JoshAPI.playlist(
        interaction.guild!.id,
        interaction.channel!.id,
        interaction.user.id
  ***REMOVED***

      if (request.linked) {
        await prisma.joshChannel.create({
          data: {
            id: interaction.channel!.id,
            premium: false,
    ***REMOVED***
        ***REMOVED***

        const embed = new StandardEmbed(interaction.user as User)
          .setDescription(
            `All Spotify links in this channel will now be added to your shared playlist! Open the playlist by clicking the button below.`
          )
          .setColor(Constants.Colors.GREEN);

        const row = new MessageActionRow();
        row.addComponents(
          new MessageButton().setStyle("LINK").setURL(request.playlistUrl).setLabel("Open Playlist")
    ***REMOVED***
        await interaction.reply({embeds: [embed], components: [row]***REMOVED***
    ***REMOVED*** else if (request.playlistUrl) {
        const embed = new StandardEmbed(interaction.user as User)
          .setDescription(
            `This channel already has a synced playlist! Click the button below to open it!`
          )
          .setColor(Constants.Colors.GREEN);

        const row = new MessageActionRow();
        row.addComponents(
          new MessageButton().setStyle("LINK").setURL(request.playlistUrl).setLabel("Open Playlist")
    ***REMOVED***
        await interaction.reply({embeds: [embed], components: [row]***REMOVED***
    ***REMOVED***
  ***REMOVED*** else if (options.subCommandName === "unsync") {
      const member = interaction.member as GuildMember;

      const canManageServer = member.permissions.has(Permissions.FLAGS.MANAGE_GUILD);

      if (!canManageServer) {
        throw new Error("You do not have permission to use this command.");
    ***REMOVED***

      const request = await JoshAPI.delete(interaction.channel!.id);

      if (request.status) {
        await interaction.reply("👌");
    ***REMOVED*** else if (request.detail.code === "SP001") {
        await interaction.reply("No synced playlist was found for this channel!");
    ***REMOVED***
  ***REMOVED***
***REMOVED***,
***REMOVED***;
