import { ChatCommand } from "../../types/command";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { SpotifyAPI } from "../../services/api/spotify";
import {LastFMAPI} from "../../services/api/lastfm";
import {StandardEmbed} from "../../structs/standard-embed";
import {GuildMember} from "discord.js";

export const artist: ChatCommand = {
  name: "artist",
  description: "Search for artist based on query.",
  inhibitors: [],
  type: "CHAT_INPUT",

  options: [
    {
      name: "query",
      description: "name of artist.",
      type: "STRING",
      required: true,
      autocomplete: true
    },
  ],
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const options = new InteractionOptions(
        interaction.options.data as unknown as InteractionOptions[]
    );

    const artistLfm = await LastFMAPI.artist(options.get("query"))
    const artistSpotify = await SpotifyAPI.searchArtist(options.get("query"))
    const embed = new StandardEmbed(interaction.member as GuildMember)
        .setAuthor(artistSpotify.name, artistSpotify.images[0].url, artistSpotify.external_urls.spotify) // i definitely should eventually reroute this to all URLs the artist has and not just spotify
        .setDescription(artistLfm.artist.bio.content.split("<a")[0]) // i hate every part of this but it works
        .setFooter(`Genres: ${artistSpotify.genres.join(', ')} • data from last.fm & Spotify`)

    await interaction.editReply({embeds: [embed] })
  },
};
