import {
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  DiscordAPIError,
  Interaction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import {chatCommandsMap, messageCommandsMap, userCommandsMap,} from "../../commands";
import {EmbedBuilder} from "@discordjs/builders";

export async function handleInteraction(
    interaction: Interaction
): Promise<void> {
  try {
    if (interaction.isUserContextMenuCommand()) return await handleUserContextInteraction(interaction)
    if (interaction.isMessageContextMenuCommand()) return await handleMessageContextInteraction(interaction)
    if (interaction.isChatInputCommand())
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

export async function handleUserContextInteraction(
    interaction: UserContextMenuCommandInteraction
): Promise<void> {
  let command;

  command = userCommandsMap.get(interaction.commandName);

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

export async function handleMessageContextInteraction(
    interaction: MessageContextMenuCommandInteraction
): Promise<void> {
  let command;

  command = messageCommandsMap.get(interaction.commandName);

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
    interaction: ChatInputCommandInteraction
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

// TODO: add boiler plate to handle button interactions.
export async function handleButtonInteraction(interaction: ButtonInteraction) {}
