import {GuildMember} from "discord.js";
import {returnLinks} from "../../services/reply-song";
import {ChatCommand} from "../../types/command";

export const spotify: ChatCommand = {
  name: "spotify",
  description: "Get links to the song you're listening to on Spotify.",
  inhibitors: [],
  type: "CHAT_INPUT",

  async run(interaction) {
    const member = interaction.member as GuildMember;

    if (!member.presence) {
      throw new Error("No Spotify presence found - are you sure you're listening to something?");
    }

    const activity = member.presence.activities.find(
      (activity: {name: string}) => activity.name === "Spotify"
    );
    if (activity) {
      await returnLinks(interaction, `https://open.spotify.com/track/${activity.syncId}`);
    } else {
      throw new Error("No Spotify presence found - are you sure you're listening to something?");
    }
  },
};
