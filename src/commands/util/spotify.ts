import {GuildMember***REMOVED*** from "discord.js";
import {returnLinks***REMOVED*** from "../../services/reply-song";
import {ChatCommand***REMOVED*** from "../../types/command";

export const spotify: ChatCommand = {
  name: "spotify",
  description: "Get links to the song you're listening to on Spotify.",
  inhibitors: [],
  type: "CHAT_INPUT",

  async run(interaction) {
    const member = interaction.member as GuildMember;

    if (!member.presence) {
      throw new Error("No Spotify presence found - are you sure you're listening to something?");
  ***REMOVED***

    const activity = member.presence.activities.find(
      (activity: {name: string***REMOVED***) => activity.name === "Spotify"
***REMOVED***
    if (activity) {
      await returnLinks(interaction, `https://open.spotify.com/track/${activity.syncId***REMOVED***`);
  ***REMOVED*** else {
      throw new Error("No Spotify presence found - are you sure you're listening to something?");
  ***REMOVED***
***REMOVED***,
***REMOVED***;
