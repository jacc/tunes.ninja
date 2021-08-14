import "dotenv/config";

import {Client, Intents***REMOVED*** from "discord.js";
import {chatCommandsMap, messageCommandsMap, userCommandsMap***REMOVED*** from "./commands";
import {StandardEmbed***REMOVED*** from "./structs/standard-embed";
import {prisma***REMOVED*** from "./services/prisma";
import {redis, wrapRedis***REMOVED*** from "./services/redis";
import {isDev, permer***REMOVED*** from "./constants";
import signale from "signale";
import * as z from "zod";
import {returnLinks***REMOVED*** from "./services/reply-song";
import {guildCreate, guildDelete, startupMessage***REMOVED*** from "./services/events/logging";
import {countSearches***REMOVED*** from "./services/util/count";
import {BotRatelimited, UnknownSong***REMOVED*** from "./structs/exceptions";
import {scheduleJob***REMOVED*** from "node-schedule";
import {handleInteraction***REMOVED*** from "./services/events/interaction";
import AutoPoster from "topgg-autoposter";
import {VotesServer***REMOVED*** from "./services/util/server";

const linkSchema = z.string().refine(x => {
  return (
    x.includes("open.spotify.com/track") ||
    x.includes("open.spotify.com/album") ||
    x.includes("music.apple.com") ||
    x.includes("soundcloud.com")
  );
***REMOVED***, "");

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES);
myIntents.add(Intents.FLAGS.GUILD_MESSAGES);
myIntents.add(Intents.FLAGS.GUILDS);

const client = new Client({
  intents: myIntents,
  allowedMentions: {parse: ["users", "roles"], repliedUser: false***REMOVED***,
***REMOVED***

new VotesServer(client).start();

client.on("ready", async () => {
  signale.info("Environment:", isDev ? "dev" : "prod");
  signale.success("Ready as", client.user?.tag);
  const count = await countSearches();
  await client.user?.setPresence({
    status: "online",
    activities: [
      {
        type: "LISTENING",
        name: `${count.toString() || 0***REMOVED*** links`,
***REMOVED***
    ],
  ***REMOVED***

  if (isDev) {
    await client.guilds.cache
      .get("840584537599770635")
      ?.commands.set([
        ...chatCommandsMap.values(),
        ...messageCommandsMap.values(),
        ...userCommandsMap.values(),
      ]);

    signale.success("Loaded all commands");
    await startupMessage(client);
***REMOVED*** else {
    await client.application?.commands.set([...chatCommandsMap.values()]);
    const ap = AutoPoster(process.env.TOPGG_AUTH!, client);

    ap.on("posted", () => {
      signale.complete("Posted guild stats to top.gg");
    ***REMOVED***
***REMOVED***
***REMOVED***

client.on("messageCreate", async message => {
  if (!message.guild || message.author.bot) return;

  const url = linkSchema.safeParse(message.content);
  if (url.success) {
    const matches = url.data.match(/\bhttps?:\/\/\S+/gi);

    let guildSettings = await wrapRedis(
      `settings:${message.guild!.id***REMOVED***`,
      () =>
        prisma.guild.findFirst({
          where: {id: message.guild!.id***REMOVED***,
      ***REMOVED***),
      6000
***REMOVED***
    if (!guildSettings) {
      guildSettings = await prisma.guild.create({
        data: {
          id: message.guild!.id,
  ***REMOVED***
      ***REMOVED***
  ***REMOVED***

    if (!matches) return;

    matches.map(async link => {
      try {
        if (
          link.includes("spotify.com/track") ||
          (link.includes("spotify.com/album") &&
            permer.test(guildSettings!.reply_to, "replySpotify"))
        ) {
          await returnLinks(message, link);
      ***REMOVED***

        if (link.includes("music.apple.com") && permer.test(guildSettings!.reply_to, "replyAM")) {
          await returnLinks(message, link);
      ***REMOVED***

        if (
          link.includes("soundcloud.com") &&
          permer.test(guildSettings!.reply_to, "replySoundcloud")
        ) {
          await returnLinks(message, link);
      ***REMOVED***
    ***REMOVED*** catch (error) {
        if (error instanceof UnknownSong) {
          await message.react("❓");
      ***REMOVED*** else if (error instanceof BotRatelimited) {
          await message.reply({
            embeds: [
              new StandardEmbed(message.author).setDescription(
                `The bot is currently ratelimited. Try again in a minute.`
              ),
            ],
          ***REMOVED***
      ***REMOVED***
        return;
    ***REMOVED***
    ***REMOVED***
***REMOVED***
***REMOVED***

client.on("interactionCreate", handleInteraction);
client.on("guildCreate", guildCreate);
client.on("guildDelete", guildDelete);

scheduleJob("*/10 * * * *", async () => {
  const count = await countSearches();

  await client.user?.setPresence({
    status: "online",
    activities: [
      {
        type: "LISTENING",
        name: `${count.toString() || 0***REMOVED*** links`,
***REMOVED***
    ],
  ***REMOVED***
***REMOVED***

prisma.$connect().then(async () => {
  signale.info("Connected to Database");
  await redis.connect();
  signale.info("Connected to Redis");
  await client.login(process.env.DISCORD_TOKEN);
  signale.info("Connected to Discord");
***REMOVED***
