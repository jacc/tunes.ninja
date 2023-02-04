import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { env } from "../env";
import { chatCommandsMap, messageCommandsMap } from "./commands";
import { handleInteraction } from "./interactions";
import { prisma } from "./services/prisma";
// import { redis } from "./services/redis";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
const restClient = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

client.on("ready", async () => {
  try {
    await restClient.put(
      Routes.applicationGuildCommands(
        "842471257772523550",
        "840584537599770635"
      ),
      { body: chatCommandsMap }
    );
    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }

  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("interactionCreate", handleInteraction);
client.on("messageCreate", async (message) => {
  console.log(message);
});

prisma.$connect().then(async () => {
  console.log("Connected to Database");
  // await redis.connect();
  // console.log("Connected to Redis");
  await client.login(env.DISCORD_TOKEN);
  console.log("Connected to Discord");
});
