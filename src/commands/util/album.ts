import { ChatCommand } from "../../types/command";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { returnLinks } from "../../services/reply-song";
import { SpotifyAPI } from "../../services/api/spotify";

export const album: ChatCommand = {
  name: "album",
  description: "Search for album based on query.",
  inhibitors: [],
  type: "CHAT_INPUT",

  options: [
    {
      name: "query",
      description: "name of album.",
      type: "STRING",
      required: true,
      autocomplete: true
    },
  ],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );

    if(options.get('query').includes("spotify:album")) {
      await returnLinks(
          interaction,
          `https://open.spotify.com/album/${options.get('query').split(":")[2]}`
      );
    } else {
      const song = await SpotifyAPI.searchAlbum(options.get("query"));
      await returnLinks(
          interaction,
          `https://open.spotify.com/album/${song.split(":")[2]}`
      );
    }
  },
};
