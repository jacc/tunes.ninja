import "dotenv/config";

import { Client, Intents } from "discord.js";
import {
  chatCommandsMap,
  messageCommandsMap,
  userCommandsMap,
} from "./commands";
import { StandardEmbed } from "./structs/standard-embed";
import { prisma } from "./services/prisma";
import { redis, wrapRedis } from "./services/redis";
import { isDev, permer } from "./constants";
import signale from "signale";
import * as z from "zod";
import { returnLinks } from "./services/reply-song";
import {
  guildCreate,
  guildDelete,
  startupMessage,
} from "./services/events/logging";
import { countProfiles, countSearches } from "./services/util/count";
import { BotRatelimited, UnknownSong } from "./structs/exceptions";
import { scheduleJob } from "node-schedule";
import { handleInteraction } from "./services/events/interaction";
import AutoPoster from "topgg-autoposter";
import { VotesServer } from "./services/util/server";
import { Topgg } from "./services/api/topgg";
import {DataDog} from "./services/api/datadog";
import * as Sentry from "@sentry/node";



const linkSchema = z.string().refine((x) => {
  return (
    x.includes("open.spotify.com/track") ||
    x.includes("open.spotify.com/album") ||
    x.includes("music.apple.com") ||
    x.includes("soundcloud.com")
  );
}, "");

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES);
myIntents.add(Intents.FLAGS.GUILD_MESSAGES);
myIntents.add(Intents.FLAGS.GUILDS);

const client = new Client({
  intents: myIntents,
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
});

new VotesServer(client).start();

Sentry.init({
  dsn: process.env.SENTRY,
  tracesSampleRate: 1.0,
});

const dd = new DataDog()

client.on("ready", async () => {
  signale.info("Environment:", isDev ? "dev" : "prod");
  signale.success("Ready as", client.user?.tag);
  const count = await countSearches();
  await client.user?.setPresence({
    status: "online",
    activities: [
      {
        type: "LISTENING",
        name: `${count.toString() || 0} links`,
      },
    ],
  });

  if (isDev) {
    await client.guilds.cache
      .get("840584537599770635")
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
    const ap = AutoPoster(process.env.TOPGG_AUTH!, client);

    ap.on("posted", () => {
      signale.complete("Posted stats to top.gg!");
    });
    await startupMessage(client);
  }
});

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const url = linkSchema.safeParse(message.content);
  if (url.success) {
    const matches = url.data.match(/\bhttps?:\/\/\S+/gi);

    let guildSettings = await wrapRedis(
      `settings:${message.guild!.id}`,
      () =>
        prisma.guild.findFirst({
          where: { id: message.guild!.id },
        }),
      6000
    );
    if (!guildSettings) {
      guildSettings = await prisma.guild.create({
        data: {
          id: message.guild!.id,
        },
      });
    }

    if (!matches) return;

    matches.map(async (link) => {
      try {
        if (
          link.includes("spotify.com/track") ||
          (link.includes("spotify.com/album") &&
            permer.test(guildSettings!.reply_to, "replySpotify"))
        ) {
          await returnLinks(message, link);
        }

        if (
          link.includes("music.apple.com") &&
          permer.test(guildSettings!.reply_to, "replyAM")
        ) {
          await returnLinks(message, link);
        }

        if (
          link.includes("soundcloud.com") &&
          permer.test(guildSettings!.reply_to, "replySoundcloud")
        ) {
          await returnLinks(message, link);
        }
      } catch (error) {
        if (error instanceof UnknownSong) {
          await message.react("❓");
        } else if (error instanceof BotRatelimited) {
          await message.reply({
            embeds: [
              new StandardEmbed(message.author).setDescription(
                `The bot is currently ratelimited. Try again in a minute.`
              ),
            ],
          });
        }
        return;
      }
    });
  }
});
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
        name: `${count.toString() || 0} links`,
      },
    ],
  });
});

scheduleJob("*/5 * * * *", async () => {
  const songs = await countSearches();
  const profiles = await countProfiles();
  const guilds = await client.guilds.cache.size;
  const votes = await new Topgg(client.user!.id).getVotes();
  await dd.send("bot.guilds", guilds);
  await dd.send("bot.songs", songs);
  await dd.send("bot.profiles", profiles);
  await dd.send("bot.votes", votes.monthlyPoints);
});

prisma.$connect().then(async () => {
  signale.info("Connected to Database");
  await redis.connect();
  signale.info("Connected to Redis");
  await client.login(process.env.DISCORD_TOKEN);
  signale.info("Connected to Discord");
});


process
    .on('uncaughtException', async err => {
      Sentry.captureException(err)
    });
