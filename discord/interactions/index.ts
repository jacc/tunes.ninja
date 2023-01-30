import type { CommandInteraction, Interaction } from "discord.js";
import { DiscordAPIError, EmbedBuilder } from "discord.js";
import { chatCommandsMap } from "../commands";

export async function handleInteraction(
  interaction: Interaction
): Promise<void> {
  if (interaction.isCommand()) return handleMessageInteraction(interaction);
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
  } catch (e: unknown) {
    console.log(e);
    switch (true) {
      case e instanceof DiscordAPIError:
        break;
      default:
        try {
          if (!interaction.deferred) {
            await interaction.reply({
              ephemeral: true,
              embeds: [new EmbedBuilder().setDescription(`⚠ 123`)],
              components: [],
            });
          } else {
            await interaction.editReply({
              embeds: [new EmbedBuilder().setDescription(`⚠ 123`)],
              components: [],
            });
          }
        } catch (error: unknown) {
          await interaction.channel?.send({
            embeds: [
              new EmbedBuilder().setDescription(`⚠ 123`),
              new EmbedBuilder().setDescription(`⚠ 123`),
            ],
            components: [],
          });
          console.log(error);
        }
    }
  }
}
