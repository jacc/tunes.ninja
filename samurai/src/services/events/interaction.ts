import {
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ContextMenuCommandInteraction,
  DiscordAPIError,
  Interaction,
} from "discord.js";
import {chatCommandsMap, messageCommandsMap, userCommandsMap,} from "../../commands";
import {EmbedBuilder} from "@discordjs/builders";

export async function handleInteraction(
  interaction: Interaction
): Promise<void> {
  try {
    if (interaction.isContextMenuCommand())
      return await handleContextInteraction(interaction);
    if (interaction.isCommand())
      return await handleMessageInteraction(interaction);
    if (interaction.isButton())
      return await handleButtonInteraction(interaction);
  } catch (e: any) {
    console.error(e);
    interaction.channel?.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`\`\`\`${e.message}\n${e.stack}\`\`\``)
          .setTitle("Debug Error"),
      ],
    });
  }
}

export async function handleContextInteraction(
  interaction: ContextMenuCommandInteraction
): Promise<void> {
  let command;

  switch (interaction.targetId) {
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
              embeds: [new EmbedBuilder().setDescription(`⚠ ${e.message}`)],
              components: [],
            });
          } else {
            await interaction.editReply({
              embeds: [new EmbedBuilder().setDescription(`⚠ ${e.message}`)],
              components: [],
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
              embeds: [new EmbedBuilder().setDescription(`⚠ ${e.message}`)],
              components: [],
            });
          } else {
            await interaction.editReply({
              embeds: [new EmbedBuilder().setDescription(`⚠ ${e.message}`)],
              components: [],
            });
          }
        } catch (error: any) {
          await interaction.channel?.send({
            embeds: [
              new EmbedBuilder().setDescription(`⚠ ${e.message}`),
              new EmbedBuilder().setDescription(`⚠ ${error.message}`),
            ],
            components: [],
          });
          console.log(error);
        }
    }
  }
}

export async function handleButtonInteraction(interaction: ButtonInteraction) {}
