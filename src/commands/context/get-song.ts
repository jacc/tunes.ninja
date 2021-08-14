import {UserCommand***REMOVED*** from "../../types/command";
import {GuildMember***REMOVED*** from "discord.js";
import {returnLinks***REMOVED*** from "../../services/reply-song";
import {voted***REMOVED*** from "../../inhibitors/voted";

export const getSong: UserCommand = {
  name: "Get Song",
  type: "USER",
  inhibitors: [voted],
  async run(interaction) {
    const member = interaction.member as GuildMember;

    if (!member.presence) {
      throw new Error("No Spotify presence found - are you sure you're listening to something?");
  ***REMOVED***

    const activity = member.presence.activities.find(activity => activity.name === "Spotify");

    if (activity) {
      await returnLinks(interaction, `https://open.spotify.com/track/${activity.syncId***REMOVED***`);
  ***REMOVED*** else {
      throw new Error("No Spotify presence found - are you sure you're listening to something?");
  ***REMOVED***
***REMOVED***,
***REMOVED***;
