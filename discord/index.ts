import { Client, REST, Routes } from "discord.js";
import { env } from "../env";
import { chatCommandsMap } from "./commands";
import { handleInteraction } from "./interactions";

const client = new Client({
  intents: ["GuildMessages", "GuildPresences"],
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
});

client.on("ready", async () => {
  const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

  const slashCommands = chatCommandsMap;

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        "842471257772523550",
        "840584537599770635"
      ),
      { body: slashCommands }
    );
  } catch (error) {
    console.error(error);
  }

  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("interactionCreate", handleInteraction);

void client.login(env.DISCORD_TOKEN);
