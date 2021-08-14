import {ChatCommand} from "../../types/command";
import {InteractionOptions} from "../../services/util/interactionOptions";
import {returnLinks} from "../../services/reply-song";
import {SpotifyAPI} from "../../services/api/spotify";

export const song: ChatCommand = {
  name: "song",
  description: "Search for song based on query.",
  inhibitors: [],
  type: "CHAT_INPUT",

  options: [
    {
      name: "query",
      description: "name of song and artist.",
      type: "STRING",
      required: true,
    },
  ],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );
    const song = await SpotifyAPI.search(options.get("query"));
    await returnLinks(interaction, `https://open.spotify.com/track/${song.split(":")[2]}`);
  },
};
