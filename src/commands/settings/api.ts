import { MessageActionRow, MessageButton } from "discord.js";
import { voted } from "../../inhibitors/voted";
import { JoshAPI } from "../../services/api/josh";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { ChatCommand } from "../../types/command";

export const api: ChatCommand = {
  name: "api",
  description: "Interact with tunes.ninja's API.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "link",
      description: "Link your Spotify account to the tunes.ninja playlist API.",
      type: "SUB_COMMAND",
    },
    {
      name: "unlink",
      description:
        "Unlink your Spotify account to the tunes.ninja playlist API",
      type: "SUB_COMMAND",
    },
  ],
  inhibitors: [voted],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );

    if (options.subCommandName === "link") {
      const user = await JoshAPI.user(interaction.member!.user.id);

      console.log(user);

      const row = new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId("button_spotify")
          .setLabel("Spotify")
          .setStyle("SUCCESS"),
        new MessageButton()
          .setCustomId("button_apple-music")
          .setLabel("Apple Music")
          .setStyle("DANGER"),
      ]);

      await interaction.reply({
        content: "Select a platform to link!",
        components: [row],
        ephemeral: true,
      });
    }
    // } else if (options.subCommandName === "unlink") {
    //   const request = await JoshAPI.unlink(interaction.user.id);

    //   if (!request) throw new Error("Internal error, do `/support");
    //   await interaction.reply({
    //     content: `If you had an account, it will be deleted!`,
    //     ephemeral: true,
    //   });
    // }
  },
};
