import {
  CommandInteraction,
  ContextMenuInteraction,
  DiscordAPIError,
  GuildMember,
  Interaction,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import {
  chatCommandsMap,
  messageCommandsMap,
  userCommandsMap,
} from "../../commands";
import { StandardEmbed } from "../../structs/standard-embed";

export async function handleInteraction(
  interaction: Interaction
): Promise<void> {
  if (interaction.isContextMenu())
    return await handleContextInteraction(interaction);
  if (interaction.isCommand())
    return await handleMessageInteraction(interaction);
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
  } catch (e: any) {
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
          console.log(error);
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
  } catch (e: any) {
    console.log(e);
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
          console.log(error);
        }
    }
  }
}
