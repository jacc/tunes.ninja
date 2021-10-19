import { ChatCommand } from "../../types/command";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { returnLinks } from "../../services/reply-song";
import { SpotifyAPI } from "../../services/api/spotify";

export const song: ChatCommand = {
  name: "song",
  description: "Search for song based on query.",
  inhibitors: [],
  type: "CHAT_INPUT",
  options: [
    {
      name: "song",
      description: "Name of song and artist.",
      type: "STRING",
      required: true,
      autocomplete: true
    },
  ],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );
    if(options.get('song').includes("spotify:track")) {
      await returnLinks(
          interaction,
          `https://open.spotify.com/track/${options.get('song').split(":")[2]}`
      );
    } else {
      const song = await SpotifyAPI.searchSong(options.get("song"));
      await returnLinks(
          interaction,
          `https://open.spotify.com/track/${song.split(":")[2]}`
      );
    }

  },
};
