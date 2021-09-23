import { ChatCommand } from "../../types/command";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { returnLinks } from "../../services/reply-song";
import { SpotifyAPI } from "../../services/api/spotify";
import { fetchGenius } from "../../services/api/genius";
import { StandardEmbed } from "../../structs/standard-embed";
import { MessageEmbed } from "discord.js";

export const lyrics: ChatCommand = {
  name: "lyrics",
  description: "Search for song lyrics based on query.",
  inhibitors: [],
  type: "CHAT_INPUT",

  options: [
    {
      name: "artist",
      description: "Name of artist.",
      type: "STRING",
      required: true,
    },
    {
      name: "song",
      description: "Name of song.",
      type: "STRING",
      required: true,
    },
  ],
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );
    const artist = options.get("artist");
    const title = options.get("song");
    const lyrics = await fetchGenius({ artist, title });

    const embed = new MessageEmbed().setDescription(lyrics.staticLyrics!);
    await interaction.editReply({ embeds: [embed] });
  },
};
