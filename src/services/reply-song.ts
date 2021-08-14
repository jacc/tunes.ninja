import {
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  User,
***REMOVED*** from "discord.js";
import {StandardEmbed***REMOVED*** from "../structs/standard-embed";
import {JoshAPI***REMOVED*** from "./api/josh";
import {SongsApi***REMOVED*** from "./api/song";
import {incrementSearches, prisma***REMOVED*** from "./prisma";

export async function returnLinks(
  message: Message | CommandInteraction | ContextMenuInteraction,
  link: string
): Promise<void> {
  let author;

  if ("author" in message) {
    author = message.author;
***REMOVED*** else {
    if (!message.deferred) {
      await message.deferReply();
  ***REMOVED***
    author = message.member;
***REMOVED***

  const song = await SongsApi.getLinks(link);
  if (!song.links) return;

  // TODO: redo this eventually
  let group;
  if (Object.entries(song.links).filter(link => link[1]).length === 6) {
    group = chunk(
      Object.entries(song.links).filter(link => link[1]),
      3
***REMOVED***
***REMOVED*** else {
    group = chunk(
      Object.entries(song.links).filter(link => link[1]),
      5
***REMOVED***
***REMOVED***

  const rows = group.map(chunks => {
    const row = new MessageActionRow();
    chunks.map(chunk => {
      return row.addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setURL(chunk[1] as string)
          .setEmoji(PLATFORM_EMOJI[chunk[0]])
  ***REMOVED***
    ***REMOVED***
    return row;
  ***REMOVED***

  const embed = new StandardEmbed(author as User).setAuthor(
    `${song.title***REMOVED*** by ${song.artist***REMOVED***`,
    song.thumbnail ? song.thumbnail : ""
  );

  if (Math.floor(Math.random() * 10) == 1) {
    embed.setDescription(
      "*:ninja: [Psst - vote for us on Top.gg! It really helps the developer out, so click this!](https://tunes.ninja/vote)*"
***REMOVED***
***REMOVED***

  if (message instanceof Message) {
    await message.reply({embeds: [embed], components: rows***REMOVED***
***REMOVED*** else {
    await message.editReply({embeds: [embed], components: rows***REMOVED***
***REMOVED***

  const channel = await prisma.joshChannel.findUnique({
    where: {
      id: message.channel!.id,
  ***REMOVED***,
  ***REMOVED***

  if (channel) {
    await JoshAPI.add(message, link);
***REMOVED***
  await incrementSearches(author as User);
***REMOVED***

function chunk<T>(array: T[], size: number): T[][] {
  const results: T[][] = [];
  while (array.length) {
    const spliced = array.splice(0, size);
    results.push(spliced);
***REMOVED***
  return results;
***REMOVED***

export const PLATFORM_EMOJI: Record<string, string> = {
  apple_music: "<:apple_music:847868738870968380>",
  soundcloud: "<:soundcloud:847868739257106453>",
  spotify: "<:spotify:847868739298131998>",
  tidal: "<:tidal:847868738254012467>",
  youtube: "<:youtube:847883855344042044>",
  youtube_music: "<:youtube_music:847868739172827156>",
***REMOVED***;
