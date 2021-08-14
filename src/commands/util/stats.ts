import {GuildMember, User} from "discord.js";
import {contributors} from "../../constants";
import {countProfiles, countSearches} from "../../services/util/count";
import {StandardEmbed} from "../../structs/standard-embed";
import {ChatCommand} from "../../types/command";

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
      contributors.map(c => interaction.client.users.fetch(c as `${bigint}`).then(m => m.tag))
    ).then(tags =>
      tags
        .map(tag => {
          return `- ${tag}`;
        })
        .join("\n")
    );
    await interaction.reply({
      ephemeral: true,
      embeds: [
        new StandardEmbed(interaction.member as GuildMember)
          .addField(
            "Guilds",
            `\`\`\`${interaction.client.guilds.cache.size.toString()}\`\`\``,
            true
          )
          .addField("Users", `\`\`\`${interaction.client.users.cache.size.toString()}\`\`\``, true)
          .addField("Songs Searched", `\`\`\`${count.toString()}\`\`\``, true)
          .addField("Profiles", `\`\`\`${profiles.toString()}\`\`\``, true)
          .addField("Created by", `\`\`\`${owner}\`\`\``)
          .addField("Contributions by", `\`\`\`${tags}\`\`\``),
      ],
    });
  },
};
