import { UserCommand } from "../../types/command";
import { GuildMember } from "discord.js";
import { returnLinks } from "../../services/reply-song";
import { voted } from "../../inhibitors/voted";

export const getSong: UserCommand = {
  name: "Get Song",
  type: "USER",
  inhibitors: [voted],
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const member = interaction.member as GuildMember;

    if (!member.presence) {
      throw new Error(
        "No Spotify presence found - are you sure you're listening to something?"
      );
    }

    const activity = member.presence.activities.find(
      (activity) => activity.name === "Spotify"
    );

    if (activity) {
      await returnLinks(
        interaction,
        `https://open.spotify.com/track/${activity.syncId}`
      );
    } else {
      throw new Error(
        "No Spotify presence found - are you sure you're listening to something?"
      );
    }
  },
};
