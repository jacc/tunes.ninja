import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  DiscordAPIError,
  GuildMember,
  Interaction,
  SelectMenuInteraction,
} from "discord.js";
import {
  chatCommandsMap,
  messageCommandsMap,
  userCommandsMap,
} from "../../commands";
import { StandardEmbed } from "../../structs/standard-embed";
import { DataDog } from "../api/datadog";
import { JoshAPI } from "../api/josh";

const dd = new DataDog();

export async function handleInteraction(
  interaction: Interaction
): Promise<void> {
  if (interaction.isContextMenu())
    return await handleContextInteraction(interaction);
  if (interaction.isCommand())
    return await handleMessageInteraction(interaction);
  if (interaction.isSelectMenu())
    return await handleSelectInteraction(interaction);
  if (interaction.isButton()) return await handleButtonInteraction(interaction);
}

export async function handleContextInteraction(
  interaction: ContextMenuInteraction
): Promise<void> {
  dd.inc(`interactions.ContextMenuInteraction.run`);
  let command;

  switch (interaction.targetType) {
    case "USER":
      command = userCommandsMap.get(interaction.commandName);
      break;
    case "MESSAGE":
      command = messageCommandsMap.get(interaction.commandName);
      break;
  }

  if (!command) return;

  const inhibitors = Array.isArray(command.inhibitors)
    ? command.inhibitors
    : [command.inhibitors];

  try {
    for (const inhibitor of inhibitors) {
      await inhibitor(interaction);
    }

    await command.run(interaction);
  } catch (e) {
    switch (true) {
      case e instanceof DiscordAPIError:
        break;
      default:
        try {
          if (!interaction.deferred) {
            await interaction.reply({
              ephemeral: true,
              embeds: [
                new StandardEmbed(
                  interaction.member as GuildMember
                ).setDescription(`⚠ ${e.message}`),
              ],
            });
          } else {
            await interaction.editReply({
              embeds: [
                new StandardEmbed(
                  interaction.member as GuildMember
                ).setDescription(`⚠ ${e.message}`),
              ],
            });
          }
        } catch (error) {
          console.log("just give up");
        }
    }
  }
}

export async function handleMessageInteraction(
  interaction: CommandInteraction
): Promise<void> {
  dd.inc(`interactions.CommandInteraction.run`);
  const command = chatCommandsMap.get(interaction.commandName);

  if (!command) return;

  const inhibitors = Array.isArray(command.inhibitors)
    ? command.inhibitors
    : [command.inhibitors];

  try {
    for (const inhibitor of inhibitors) {
      await inhibitor(interaction);
    }

    await command.run(interaction);
  } catch (e) {
    switch (true) {
      case e instanceof DiscordAPIError:
        break;
      default:
        try {
          if (!interaction.deferred) {
            await interaction.reply({
              ephemeral: true,
              embeds: [
                new StandardEmbed(
                  interaction.member as GuildMember
                ).setDescription(`⚠ ${e.message}`),
              ],
            });
          } else {
            await interaction.editReply({
              embeds: [
                new StandardEmbed(
                  interaction.member as GuildMember
                ).setDescription(`⚠ ${e.message}`),
              ],
            });
          }
        } catch (error) {
          console.log("just give up");
        }
    }
  }
}

export async function handleSelectInteraction(
  interaction: SelectMenuInteraction
): Promise<void> {
  await interaction.deferUpdate();
  dd.inc(`interactions.SelectMenuInteraction.run`);
  const userId = interaction.customId.split("select_")[1];
  const playlistId = interaction.values[0].split("_")[1];
  const songId = interaction.values[0].split("_")[2];
  const request = await JoshAPI.addPersonalPlaylist(userId, playlistId, songId);
  if (request.status === true) {
    await interaction.editReply({
      embeds: [
        new StandardEmbed(interaction.member as GuildMember).setDescription(
          `<:check:875543430464430081> Added the song to your playlist!`
        ),
      ],
      components: [],
    });
  }
}

export async function handleButtonInteraction(
  interaction: ButtonInteraction
): Promise<void> {
  await interaction.deferUpdate();
  dd.inc(`interactions.ButtonInteraction.run`);
  const platform = interaction.customId.split("_")[1];
  const action = interaction.customId.split("_")[2];

  if (action === "link") {
    const request = await JoshAPI.link(
      interaction.guild!.id,
      interaction.channel!.id,
      interaction.user!.id,
        platforms[platform]
    );

    await interaction.editReply({
      components: [],
      content: `[Click here to link your ${platform
        .split("-")
        .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(" ")} account to tunes.ninja!](${request})`,
    });
  } else if (action === "unlink") {
    console.log(platforms[platform])
    const request = await JoshAPI.unlink(interaction.user!.id, platforms[platform]);
    console.log(request)
    await interaction.editReply({
      components: [],
      content: request
        ? `Unlinked your ${platform
            .split("-")
            .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
            .join(" ")} account!`
        : "Couldn't unlink.",
    });
  }
}

export const platforms: Record<string, string> = {
  "apple-music": "appleMusic",
  "spotify": "spotify"
}
