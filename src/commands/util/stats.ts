import {GuildMember, User***REMOVED*** from "discord.js";
import {contributors***REMOVED*** from "../../constants";
import {countProfiles, countSearches***REMOVED*** from "../../services/util/count";
import {StandardEmbed***REMOVED*** from "../../structs/standard-embed";
import {ChatCommand***REMOVED*** from "../../types/command";

export const stats: ChatCommand = {
  name: "stats",
  description: "Get bot stats.",
  inhibitors: [],
  type: "CHAT_INPUT",

  async run(interaction) {
    const count = await countSearches();
    const profiles = await countProfiles();
    const owner = ((await interaction.client.users.fetch("657057112593268756")) as User)?.tag;
    const tags = await Promise.all(
      contributors.map(c => interaction.client.users.fetch(c as `${bigint***REMOVED***`).then(m => m.tag))
    ).then(tags =>
      tags
        .map(tag => {
          return `- ${tag***REMOVED***`;
      ***REMOVED***)
        .join("\n")
***REMOVED***
    await interaction.reply({
      ephemeral: true,
      embeds: [
        new StandardEmbed(interaction.member as GuildMember)
          .addField(
            "Guilds",
            `\`\`\`${interaction.client.guilds.cache.size.toString()***REMOVED***\`\`\``,
            true
          )
          .addField("Users", `\`\`\`${interaction.client.users.cache.size.toString()***REMOVED***\`\`\``, true)
          .addField("Songs Searched", `\`\`\`${count.toString()***REMOVED***\`\`\``, true)
          .addField("Profiles", `\`\`\`${profiles.toString()***REMOVED***\`\`\``, true)
          .addField("Created by", `\`\`\`${owner***REMOVED***\`\`\``)
          .addField("Contributions by", `\`\`\`${tags***REMOVED***\`\`\``),
      ],
    ***REMOVED***
***REMOVED***,
***REMOVED***;
