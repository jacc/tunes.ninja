import { ChatCommand } from "../../types/command";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { returnLinks } from "../../services/reply-song";
import { SpotifyAPI } from "../../services/api/spotify";
import { fetchGenius } from "../../services/api/genius";
import { StandardEmbed } from "../../structs/standard-embed";
import { GuildMember, MessageEmbed, User } from "discord.js";
import { SongsApi } from "../../services/api/song";
import {UnknownSong} from "../../structs/exceptions";

export const lyrics: ChatCommand = {
  name: "lyrics",
  description: "Search for song lyrics based on Spotify status or query.",
  inhibitors: [],
  type: "CHAT_INPUT",

  options: [
    {
      name: "song",
      description: "Name of song.",
      type: "STRING",
      required: false,
      autocomplete: true
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

    if (!activity && !options.has("song"))
      throw new Error("No Spotify presence found or arguments passed.");

    const title = options.has("song") ? options.get("song") : activity?.details;
    const artist = activity?.state;

    if (title.includes("spotify:track")) {
      const songInfo = await SongsApi.getLinks(`https://open.spotify.com/track/${title.split(":")[2]}`)
      if (!songInfo) {
        throw new UnknownSong();
      }

      const song = await SpotifyAPI.searchSongMetaData(`${songInfo.title} ${songInfo.artist}`);

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

    } else {
      const song = await SpotifyAPI.searchSongMetaData(`${title} ${artist}`);

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
    }
  },
};
