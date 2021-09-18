import {GuildMember, MessageEmbed, User} from "discord.js";
import {contributors} from "../../constants";
import {countGuilds, countPlaylists, countProfiles, countSearches, countVotes} from "../../services/util/count";
import {StandardEmbed} from "../../structs/standard-embed";
import {ChatCommand} from "../../types/command";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const stats: ChatCommand = {
  name: "stats",
  description: "Get bot stats.",
  inhibitors: [],
  type: "CHAT_INPUT",

  async run(interaction) {
    await interaction.deferReply({ephemeral: true})
    const songs = await countSearches();
    const profiles = await countProfiles();
    const playlists = await countPlaylists();
    const guilds = await countGuilds(interaction.client);
    const votes = await countVotes(interaction.client);

    const owner = ((await interaction.client.users.fetch("657057112593268756")) as User)?.tag;
    const tags = await Promise.all(
      contributors.map(c => interaction.client.users.fetch(c as `${bigint}`).then(m => m.tag))
    ).then(tags =>
      tags
        .map(tag => {
          return `» ${tag}`;
        })
        .join("\n")
    );
    // await interaction.reply({
    //   ephemeral: true,
    //   embeds: [
    //     new StandardEmbed(interaction.member as GuildMember)
    //       .addField(
    //         "Guilds",
    //         `\`\`\`${interaction.client.guilds.cache.size.toString()}\`\`\``,
    //         true
    //       )
    //       .addField("Users", `\`\`\`${interaction.client.users.cache.size.toString()}\`\`\``, true)
    //       .addField("Songs Searched", `\`\`\`${count.toString()}\`\`\``, true)
    //       .addField("Profiles", `\`\`\`${profiles.toString()}\`\`\``, true)
    //       .addField("Created by", `\`\`\`${owner}\`\`\``)
    //       .addField("Contributions by", `\`\`\`${tags}\`\`\``),
    //   ],
    // });

    await interaction.editReply({
      embeds: [new StandardEmbed(interaction.member as GuildMember)
          .setAuthor((interaction.member as GuildMember).user.tag, (interaction.member as GuildMember).user.displayAvatarURL())
          .setDescription("**Invite**: https://tunes.ninja/invite\n" +
              "**Vote**: https://tunes.ninja/vote\n" +
              "**GitHub**: https://tunes.ninja/github")
          .addField("Discord Stats", `» \`${guilds}\` guilds\n» \`${profiles}\` active users\n`)
          .addField("Bot Stats", `» \`${songs}\` songs searched\n» \`${playlists}\` playlists\n» \`${votes}\` votes\n» Up for \`${dayjs.duration(interaction.client!.uptime!).humanize()}\`\n`)
          .addField("Developed by", `<@657057112593268756> (\`${owner}\`)`)
          .addField("Contributions by", `${tags}`)

      ]
    })
  },
};
