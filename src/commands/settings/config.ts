import {GuildMember} from "discord.js";

import {z} from "zod";
import {permer} from "../../constants";
import {manageServer} from "../../inhibitors/permissions/manage-server";
import {prisma} from "../../services/prisma";
import {redis} from "../../services/redis";
import {InteractionOptions} from "../../services/util/interactionOptions";
import {StandardEmbed} from "../../structs/standard-embed";
import {ChatCommand} from "../../types/command";

const keyMap = {
  replyspotify: "replySpotify",
  replyam: "replyAM",
  replysoundcloud: "replySoundcloud",
} as const;

const settingSchema = z.enum(["replySpotify", "replyAM", "replySoundcloud"]);
const tfSchema = z.enum(["true", "false"]).transform(v => v === "true");

export const config: ChatCommand = {
  name: "config",
  description: "View or edit the server configuration.",
  inhibitors: [manageServer],
  defaultPermission: true,
  type: "CHAT_INPUT",
  options: [
    {
      name: "edit",
      description: "Edit the server config.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "replyspotify",
          description: "Have the bot reply to Spotify links.",
          type: "BOOLEAN",
          required: false,
        },
        {
          name: "replyam",
          description: "Have the bot reply to Apple Music links.",
          type: "BOOLEAN",
          required: false,
        },
        {
          name: "replysoundcloud",
          description: "Have the bot reply to SoundClound links.",
          type: "BOOLEAN",
          required: false,
        },
      ],
    },
    {
      name: "view",
      description: "View the server config.",
      type: "SUB_COMMAND",
    },
  ],

  async run(interaction) {
    const guildSettings = await prisma.guild.findFirst({
      where: {id: interaction.guild!.id},
    });

    if (!guildSettings) {
      throw new Error("where are your settings");
    }

    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );
    if (options.subCommandName === "edit") {
      if (options.get("edit").map.size !== 1) {
        throw new Error("You can only edit one setting at a time!");
      }
      const setting = options.get("edit").map.values().next().value.name;
      const settingKeyName = keyMap[setting as keyof typeof keyMap];
      const result = settingSchema.parse(settingKeyName);
      const value = tfSchema.parse(options.get("edit").map.values().next().value.value.toString());
      await prisma.guild.update({
        where: {
          id: interaction.guild!.id,
        },
        data: {
          reply_to: value
            ? permer.add(guildSettings.reply_to, [result])
            : permer.subtract(guildSettings.reply_to, [result]),
        },
      });

      await interaction.reply("👌");
      await redis.del(`settings:${interaction.guild!.id}`);
    } else if (options.subCommandName === "view") {
      if (!guildSettings) {
        throw new Error("how tf does ur guild not have settings");
      }

      const replySpotifyEnabled = permer.test(guildSettings.reply_to, "replySpotify");
      const replyAMEnabled = permer.test(guildSettings.reply_to, "replyAM");
      const replySoundcloudEnabled = permer.test(guildSettings.reply_to, "replySoundcloud");
      await interaction.reply({
        embeds: [
          new StandardEmbed(interaction.member as GuildMember)
            .addField("Reply to Spotify Links", replySpotifyEnabled ? "Yes" : "No")
            .addField("Reply to Apple Music links", replyAMEnabled ? "Yes" : "No")
            .addField("Reply to Soundcloud links", replySoundcloudEnabled ? "Yes" : "No")
            .setFooter("You can edit these values with @tunes.ninja editconfig."),
        ],
      });
    }
  },
};
