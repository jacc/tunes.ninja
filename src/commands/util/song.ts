import {ChatCommand***REMOVED*** from "../../types/command";
import {InteractionOptions***REMOVED*** from "../../services/util/interactionOptions";
import {returnLinks***REMOVED*** from "../../services/reply-song";
import {SpotifyAPI***REMOVED*** from "../../services/api/spotify";

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
  ***REMOVED***,
  ],
  async run(interaction) {
    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
***REMOVED***
    const song = await SpotifyAPI.search(options.get("query"));
    await returnLinks(interaction, `https://open.spotify.com/track/${song.split(":")[2]***REMOVED***`);
***REMOVED***,
***REMOVED***;
