import "dotenv/config";

import {
  ActivityType,
  APIMessageComponentEmoji,
  ButtonStyle,
  Client,
  Guild,
  IntentsBitField,
} from "discord.js";
import {
  chatCommandsMap,
  messageCommandsMap,
  userCommandsMap,
} from "./commands";
import { prisma } from "./services/prisma";
import { redis, wrapRedis } from "./services/redis";
import { isDev } from "./constants";
import { handleInteraction } from "./services/events/interaction";
import signale from "signale";
import * as z from "zod";
import {
  Flags,
  Guild as PrismaGuild,
  Prisma,
  Services,
} from "../prisma-client-js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { dispatchReply } from "./services/dispatch";
import {
  checkLinkPermission,
  returnGuildSettings,
} from "./services/helpers/utility";
const myIntents = new IntentsBitField("Guilds");

const linkSchema = z.string().refine((x) => {
  return (
    x.includes("open.spotify.com/track") ||
    x.includes("open.spotify.com/album") ||
    x.includes("music.apple.com") ||
    x.includes("soundcloud.com")
  );
}, "");

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.on("ready", async () => {
  signale.info("Environment:", isDev ? "dev" : "prod");
  signale.success("Ready as", client.user?.tag);

  await client.user?.setPresence({
    status: "online",
    activities: [
      {
        type: ActivityType.Watching,
        name: `github.com/jacc`,
      },
    ],
  });

  if (isDev) {
    if (!process.env.DEVELOPMENT_ID) {
      throw new Error("DEVELOPMENT_ID is not set, exiting...");
    }

    await client.guilds.cache
      .get(process.env.DEVELOPMENT_ID)
      ?.commands.set([
        ...chatCommandsMap.values(),
        ...messageCommandsMap.values(),
        ...userCommandsMap.values(),
      ]);

    await client.guilds.cache
      .get(process.env.DEVELOPMENT_ID)
      ?.commands.set([
        ...chatCommandsMap.values(),
        ...messageCommandsMap.values(),
        ...userCommandsMap.values(),
      ]);

    signale.success("Loaded all commands");
  } else {
    signale.info("Setting application commands...");
    await client.application?.commands.set([
      ...chatCommandsMap.values(),
      ...messageCommandsMap.values(),
      ...userCommandsMap.values(),
    ]);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return; // TODO: eventually handle direct messages, but for now we'll omit

  console.time("get guild settings");
  let guildSettings = await returnGuildSettings(message.guild.id);
  console.timeEnd("get guild settings");

  const url = linkSchema.safeParse(message.content);
  if (!url.success) return;

  const matches = url.data.match(/((\w+:\/\/\S+)|(\w+[\.:]\w+\S+))[^\s,\.]/gi);

  matches?.map(async (song: string) => {
    if (!guildSettings) return;
    console.time("check link permission");
    const allowedToReply = await checkLinkPermission(song, guildSettings);
    console.timeEnd("check link permission");
    if (!allowedToReply) return;
    await dispatchReply(message, song, guildSettings);
  });
});

client.on("interactionCreate", handleInteraction);

prisma.$connect().then(async () => {
  signale.info("Connected to Database");
  await redis.connect();
  signale.info("Connected to Redis");
  await client.login(process.env.DISCORD_TOKEN);
  signale.info("Connected to Discord");
});
