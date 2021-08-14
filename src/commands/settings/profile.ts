import {User***REMOVED*** from "discord.js";
import {contributors, friends***REMOVED*** from "../../constants";
import {LastFMAPI***REMOVED*** from "../../services/api/lastfm";
import {prisma***REMOVED*** from "../../services/prisma";
import {InteractionOptions***REMOVED*** from "../../services/util/interactionOptions";
import {StandardEmbed***REMOVED*** from "../../structs/standard-embed";
import {ChatCommand***REMOVED*** from "../../types/command";

export const profile: ChatCommand = {
  name: "profile",
  description: "View your profile.",
  inhibitors: [],
  defaultPermission: true,
  type: "CHAT_INPUT",
  options: [
    {
      name: "edit",
      description: "Edit your profile.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "lastfm",
          description: "Set your Last.fm username.",
          type: "STRING",
          required: false,
  ***REMOVED***
        {
          name: "description",
          description: "Set your tunes.ninja profile description.",
          type: "STRING",
          required: false,
  ***REMOVED***
      ],
  ***REMOVED***,
    {
      name: "view",
      description: "View a profile.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User to view.",
          type: "USER",
          required: false,
  ***REMOVED***
      ],
  ***REMOVED***,
  ],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
***REMOVED***

    if (options.subCommandName === "edit") {
      if (options.get("edit").map.size !== 1) {
        throw new Error("You can only edit one setting at a time!");
    ***REMOVED***

      const setting = options.get("edit").map.values().next().value.name;
      const value = options.get("edit").map.values().next().value.value.toString();

      const userSettings = await prisma.user.findFirst({
        where: {id: interaction.user.id***REMOVED***,
      ***REMOVED***

      const id = interaction.user.id;

      if (!userSettings) {
        switch (setting) {
          case "lastfm":
            await prisma.user.create({
              data: {id, lastfm: value***REMOVED***,
            ***REMOVED***
            break;
          case "description":
            await prisma.user.create({
              data: {id, description: value***REMOVED***,
            ***REMOVED***
            break;
      ***REMOVED***
    ***REMOVED*** else {
        switch (setting) {
          case "lastfm":
            await prisma.user.update({
              where: {id***REMOVED***,
              data: {lastfm: value***REMOVED***,
            ***REMOVED***
            break;
          case "description":
            await prisma.user.update({
              where: {id***REMOVED***,
              data: {description: value***REMOVED***,
            ***REMOVED***
            break;
      ***REMOVED***
    ***REMOVED***
      await interaction.reply("👌");
  ***REMOVED*** else if (options.subCommandName === "view") {
      await interaction.deferReply();
      const id =
        options.get("view").map.size === 1
          ? options.get("view").map.values().next().value.value
          : interaction.member?.user.id;

      const userSettings = await prisma.user.findFirst({
        where: {id: id***REMOVED***,
      ***REMOVED***

      if (!userSettings) {
        throw new Error("This user doesn't have a profile!");
    ***REMOVED***

      const user = (await interaction.guild?.members.fetch(id))?.user;
      const profile = new StandardEmbed(interaction.user as User)
        .setTitle(`${user?.tag***REMOVED*** ${emoji(id)***REMOVED***`)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user?.id***REMOVED***/${user?.avatar***REMOVED***`)
        .setDescription(userSettings?.description)
        .addField(":mag: Searches", userSettings.searches.toString(), true);

      if (userSettings.lastfm) {
        profile.addField(
          "Last.fm",
          `[${userSettings.lastfm***REMOVED***](https://last.fm/user/${userSettings.lastfm***REMOVED***)`,
          true
    ***REMOVED***
        try {
          const lastfmData = await LastFMAPI.search(userSettings.lastfm);
          profile.addField(
            `:musical_note: ${lastfmData.np ? "Currently listening to" : "Last listened to"***REMOVED***`,
            `${lastfmData.song***REMOVED*** by ${lastfmData.artist***REMOVED***`
      ***REMOVED***
      ***REMOVED*** catch (error) {
          throw new Error(error);
      ***REMOVED***
    ***REMOVED***

      await interaction.editReply({embeds: [profile]***REMOVED***
  ***REMOVED***
***REMOVED***,
***REMOVED***;

function emoji(id: string) {
  const emojis = [];
  if (id === "657057112593268756") emojis.push("👑");
  if (contributors.includes(id)) emojis.push("⚒️");
  if (friends.includes(id)) emojis.push("❤️");
  return emojis.join(" ");
***REMOVED***
