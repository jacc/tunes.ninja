import "dotenv/config";

import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import {
  chatCommandsMap,
  messageCommandsMap,
  userCommandsMap,
} from "./commands";
import { prisma } from "./services/prisma";
import { redis } from "./services/redis";
import { isDev } from "./constants";
import { handleInteraction } from "./services/events/interaction";
import signale from "signale";
import * as z from "zod";

const linkSchema = z.string().refine((x) => {
  return (
    x.includes("open.spotify.com/track") ||
    x.includes("open.spotify.com/album") ||
    x.includes("music.apple.com") ||
    x.includes("soundcloud.com")
  );
}, "");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
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

client.on("message", async (message) => {
  console.log(message);
  if (message.author.bot) return;

  const url = linkSchema.safeParse(message.content);
  console.log(url);
});

client.on("interactionCreate", handleInteraction);

prisma.$connect().then(async () => {
  signale.info("Connected to Database");
  await redis.connect();
  signale.info("Connected to Redis");
  await client.login(process.env.DISCORD_TOKEN);
  signale.info("Connected to Discord");
});
