import {ChatCommand***REMOVED*** from "../../types/command";
import {returnLinks***REMOVED*** from "../../services/reply-song";
import {SpotifyAPI***REMOVED*** from "../../services/api/spotify";
import {LastFMAPI***REMOVED*** from "../../services/api/lastfm";
import {prisma***REMOVED*** from "../../services/prisma";
import {NoProfile***REMOVED*** from "../../structs/exceptions";
import {voted***REMOVED*** from "../../inhibitors/voted";

export const fm: ChatCommand = {
  name: "fm",
  description: "Search for song based on your Last.fm activity.",
  inhibitors: [voted],
  type: "CHAT_INPUT",

  async run(interaction) {
    const userSettings = await prisma.user.findFirst({
      where: {id: interaction.member?.user.id***REMOVED***,
    ***REMOVED***

    if (!userSettings || !userSettings.lastfm) {
      throw new NoProfile();
  ***REMOVED***

    const lastfm = await LastFMAPI.search(userSettings.lastfm);
    const song = await SpotifyAPI.search(`${lastfm.song***REMOVED*** ${lastfm.artist***REMOVED***`);
    await returnLinks(interaction, song);
***REMOVED***,
***REMOVED***;
