import { Client } from "discord.js";
import { handleInteraction } from "./interactions";

const client = new Client({
  intents: ["GuildMessages", "GuildPresences"],
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("interactionCreate", handleInteraction);

void client.login(process.env.DISCORD_TOKEN);
