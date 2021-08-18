import { MessageActionRow, MessageButton } from "discord.js";
import { voted } from "../../inhibitors/voted";
import { JoshAPI } from "../../services/api/josh";
import { PLATFORM_EMOJI } from "../../services/reply-song";
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

      console.log(user)

      const spotifyButton = new MessageButton()
        .setCustomId("button_spotify_link")
        .setLabel("Spotify")
        .setStyle("SECONDARY")
        .setEmoji(PLATFORM_EMOJI["spotify"]);
      user.services.spotify
        ? spotifyButton.setDisabled(true).setLabel("Spotify (linked)")
        : spotifyButton.setDisabled(false);

      const appleMusicButton = new MessageButton()
        .setCustomId("button_apple-music_link")
        .setLabel("Apple Music")
        .setStyle("SECONDARY")
        .setEmoji(PLATFORM_EMOJI["apple_music"]);
      user.services.appleMusic
        ? appleMusicButton.setDisabled(true).setLabel("Apple Music (linked)")
        : appleMusicButton.setDisabled(false);

      const row = new MessageActionRow().addComponents([
        spotifyButton,
        appleMusicButton,
      ]);

      await interaction.reply({
        content: "Select a platform to link!",
        components: [row],
        ephemeral: true,
      });

    } else if (options.subCommandName === "unlink") {
      const user = await JoshAPI.user(interaction.member!.user.id);

      const spotifyButton = new MessageButton()
        .setCustomId("button_spotify_unlink")
        .setLabel("Spotify")
        .setStyle("SECONDARY")
        .setEmoji(PLATFORM_EMOJI["spotify"]);
      user.services.spotify
        ? spotifyButton.setDisabled(false)
        : spotifyButton.setDisabled(true).setLabel("Spotify (unlinked)");

      const appleMusicButton = new MessageButton()
        .setCustomId("button_apple-music_unlink")
        .setLabel("Apple Music")
        .setStyle("SECONDARY")
        .setEmoji(PLATFORM_EMOJI["apple_music"]);
      user.services.appleMusic
        ? appleMusicButton.setDisabled(false)
        : appleMusicButton.setDisabled(true).setLabel("Apple Music (unlinked)");

      const row = new MessageActionRow().addComponents([
        spotifyButton,
        appleMusicButton,
      ]);

      await interaction.reply({
        content: "Select a platform to unlink!",
        components: [row],
        ephemeral: true,
      });
    }
  },
};
