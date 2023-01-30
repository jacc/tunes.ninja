import "dotenv/config";

import { Client, ActivityType } from "discord.js";
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

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers", "GuildPresences"],
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

client.on("interactionCreate", handleInteraction);

prisma.$connect().then(async () => {
  signale.info("Connected to Database");
  await redis.connect();
  signale.info("Connected to Redis");
  await client.login(process.env.DISCORD_TOKEN);
  signale.info("Connected to Discord");
});
