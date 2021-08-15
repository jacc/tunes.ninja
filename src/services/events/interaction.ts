import {
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
import { JoshAPI } from "../api/josh";

export async function handleInteraction(
  interaction: Interaction
): Promise<void> {
  if (interaction.isContextMenu())
    return await handleContextInteraction(interaction);
  if (interaction.isCommand())
    return await handleMessageInteraction(interaction);
  if (interaction.isSelectMenu())
    return await handleSelectInteraction(interaction);
}

export async function handleContextInteraction(
  interaction: ContextMenuInteraction
): Promise<void> {
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
