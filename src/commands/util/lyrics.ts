import { ChatCommand } from "../../types/command";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { returnLinks } from "../../services/reply-song";
import { SpotifyAPI } from "../../services/api/spotify";
import { fetchGenius } from "../../services/api/genius";
import { StandardEmbed } from "../../structs/standard-embed";
import { GuildMember, MessageEmbed, User } from "discord.js";
import { SongsApi } from "../../services/api/song";

export const lyrics: ChatCommand = {
  name: "lyrics",
  description: "Search for song lyrics based on Spotify status or query.",
  inhibitors: [],
  type: "CHAT_INPUT",

  options: [
    {
      name: "artist",
      description: "Name of artist.",
      type: "STRING",
      required: false,
    },
    {
      name: "song",
      description: "Name of song.",
      type: "STRING",
      required: false,
    },
  ],
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const member = interaction.member as GuildMember;

    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );

    const activity = member.presence?.activities.find(
      (activity: { name: string }) => activity.name === "Spotify"
    );

    if (!activity && !options.has("artist") && !options.has("title"))
      throw new Error("No Spotify presence found or arguments passed.");

    const artist = options.has("artist")
      ? options.get("artist")
      : activity?.state;
    const title = options.has("song") ? options.get("song") : activity?.details;

    const song = await SpotifyAPI.searchSongMetaData(`${artist} ${title}`);

    const lyrics = await fetchGenius({
      artist: song.artist,
      title: song.title,
    });

    const embed = new MessageEmbed()
      .setAuthor(
        `Lyrics for ${song.title} by ${song.artist}`,
        song.thumbnail ? song.thumbnail : ""
      )
      .setDescription(lyrics.staticLyrics!)
      .setFooter("Inaccurate or wrong? Please do /support and let us know!");
    await interaction.editReply({ embeds: [embed] });
  },
};
