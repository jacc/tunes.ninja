import { Client } from "discord.js";
import { env } from "../env";
import { handleInteraction } from "./interactions";

const client = new Client({
  intents: ["GuildMessages", "GuildPresences"],
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("interactionCreate", handleInteraction);

void client.login(env.DISCORD_TOKEN);
