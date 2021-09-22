import {User} from "discord.js";
import {contributors, friends} from "../../constants";
import {LastFMAPI} from "../../services/api/lastfm";
import {prisma} from "../../services/prisma";
import {InteractionOptions} from "../../services/util/interactionOptions";
import {StandardEmbed} from "../../structs/standard-embed";
import {ChatCommand} from "../../types/command";

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
        },
        {
          name: "description",
          description: "Set your tunes.ninja profile description.",
          type: "STRING",
          required: false,
        },
      ],
    },
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
        },
      ],
    },
  ],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );

    if (options.subCommandName === "edit") {
      if (options.get("edit").map.size !== 1) {
        throw new Error("You can only edit one setting at a time!");
      }

      const setting = options.get("edit").map.values().next().value.name;
      const value = options.get("edit").map.values().next().value.value.toString();

      const userSettings = await prisma.user.findFirst({
        where: {id: interaction.user.id},
      });

      const id = interaction.user.id;

      if (!userSettings) {
        switch (setting) {
          case "lastfm":
            await prisma.user.create({
              data: {id, lastfm: value},
            });
            break;
          case "description":
            await prisma.user.create({
              data: {id, description: value},
            });
            break;
        }
      } else {
        switch (setting) {
          case "lastfm":
            await prisma.user.update({
              where: {id},
              data: {lastfm: value},
            });
            break;
          case "description":
            await prisma.user.update({
              where: {id},
              data: {description: value},
            });
            break;
        }
      }
      await interaction.reply({ content: "👌", ephemeral: true });
    } else if (options.subCommandName === "view") {
      await interaction.deferReply();
      const id =
        options.get("view").map.size === 1
          ? options.get("view").map.values().next().value.value
          : interaction.member?.user.id;

      const userSettings = await prisma.user.findFirst({
        where: {id: id},
      });

      if (!userSettings) {
        throw new Error("This user doesn't have a profile!");
      }

      const user = (await interaction.guild?.members.fetch(id))?.user;
      const profile = new StandardEmbed(interaction.user as User)
        .setTitle(`${user?.tag} ${emoji(id)}`)
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`)
        .setDescription(userSettings?.description)
        .addField(":mag: Searches", userSettings.searches.toString(), true);

      if (userSettings.lastfm) {
        profile.addField(
          "Last.fm",
          `[${userSettings.lastfm}](https://last.fm/user/${userSettings.lastfm})`,
          true
        );
        try {
          const lastfmData = await LastFMAPI.search(userSettings.lastfm);
          profile.addField(
            `:musical_note: ${lastfmData.np ? "Currently listening to" : "Last listened to"}`,
            `${lastfmData.song} by ${lastfmData.artist}`
          );
        } catch (error) {
          throw new Error(error);
        }
      }

      await interaction.editReply({embeds: [profile]});
    }
  },
};

function emoji(id: string) {
  const emojis = [];
  if (id === "657057112593268756") emojis.push("👑");
  if (contributors.includes(id)) emojis.push("⚒️");
  if (friends.includes(id)) emojis.push("❤️");
  return emojis.join(" ");
}
