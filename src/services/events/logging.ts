import {Client, Guild, MessageEmbed, TextChannel, User***REMOVED*** from "discord.js";
import {Colors***REMOVED*** from "../../constants";
import {prisma***REMOVED*** from "../prisma";

export async function guildCreate(guild: Guild): Promise<void> {
  const guilds = guild.client.guilds.cache.size;
  const newChannel = (await guild.client.channels.fetch("840785989898469397")) as TextChannel;

  const embed = new MessageEmbed()
    .setColor(Colors.GREEN)
    .setDescription(
      `<:join:822184877776437270> Joined Discord ${guild.name***REMOVED*** (ID: \`${guild.id***REMOVED***\`) with ${guild.memberCount***REMOVED*** members.`
    )
    .setFooter(`Total guilds: ${guilds***REMOVED***`);

  await newChannel.send({embeds: [embed]***REMOVED***

  await prisma.guild.create({
    data: {
      id: guild.id,
  ***REMOVED***,
  ***REMOVED***

  const guideEmbed = new MessageEmbed()
    .setColor("#36393F")
    .setDescription(
      ":ninja: thanks for adding tunes.ninja - i convert Spotify, Apple Music and Soundcloud links to all listening platforms so you can share music with people, regardless of streaming platform.\n\nto get started, just send a Spotify, Apple Music, or SoundCloud link. do `/` to view all of my commands (they're slash commands now!)"
***REMOVED***

  const systemChannel = (await guild.systemChannel) as TextChannel;
  const guildOwner = await guild.client.users.fetch(await guild.ownerId);

  if (systemChannel) {
    await systemChannel.send({embeds: [guideEmbed]***REMOVED***).catch();
***REMOVED*** else if (guildOwner) {
    await guildOwner.send({embeds: [guideEmbed]***REMOVED***).catch();
***REMOVED*** else {
    return;
***REMOVED***
***REMOVED***

export async function guildDelete(guild: Guild): Promise<void> {
  const guilds = guild.client.guilds.cache.size;
  const newChannel = (await guild.client.channels.fetch("840785989898469397")) as TextChannel;

  const embed = new MessageEmbed()
    .setColor(Colors.RED)
    .setDescription(
      `<:leave:822184878119845888> Left Discord ${guild.name***REMOVED*** (ID: \`${guild.id***REMOVED***\`) with ${guild.memberCount***REMOVED*** members.`
    )
    .setFooter(`Total guilds: ${guilds***REMOVED***`);

  await newChannel.send({embeds: [embed]***REMOVED***
***REMOVED***

export async function startupMessage(client: Client): Promise<void> {
  const newChannel = (await client.channels.fetch("840785989898469397")) as TextChannel;

  const embed = new MessageEmbed()
    .setColor(Colors.BLUE)
    .setDescription(`:up: Bot has been booted up.`);

  await newChannel.send({embeds: [embed]***REMOVED***
***REMOVED***

export async function newVote(client: Client, user: User | string): Promise<void> {
  const embed = new MessageEmbed().setColor(Colors.BLUE);
  const newChannel = (await client.channels.fetch("840785989898469397")) as TextChannel;

  if (typeof user === "string") {
    const fetchedUser = await client.users.fetch(user);
    embed.setDescription(
      `:arrow_up: \`${fetchedUser.tag***REMOVED***\` (\`${fetchedUser.id***REMOVED***\`) upvoted us on Top.gg!`
***REMOVED***
***REMOVED*** else {
    embed.setDescription(`:arrow_up: \`${user.tag***REMOVED***\` (ID: \`${user.id***REMOVED***\`) upvoted us on Top.gg!`);
***REMOVED***

  await newChannel.send({embeds: [embed]***REMOVED***
***REMOVED***
