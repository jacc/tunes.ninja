import {Client, Guild, MessageEmbed, TextChannel, User} from "discord.js";
import {Colors} from "../../constants";
import {prisma} from "../prisma";

export async function guildCreate(guild: Guild): Promise<void> {
  const guilds = guild.client.guilds.cache.size;
  const newChannel = (await guild.client.channels.fetch("840785989898469397")) as TextChannel;

  const embed = new MessageEmbed()
    .setColor(Colors.GREEN)
    .setDescription(
      `<:join:822184877776437270> Joined Discord ${guild.name} (ID: \`${guild.id}\`) with ${guild.memberCount} members.`
    )
    .setFooter(`Total guilds: ${guilds}`);

  await newChannel.send({embeds: [embed]});

  await prisma.guild.create({
    data: {
      id: guild.id,
    },
  });

  const guideEmbed = new MessageEmbed()
    .setColor("#36393F")
    .setDescription(
      ":ninja: thanks for adding tunes.ninja - i convert Spotify, Apple Music and Soundcloud links to all listening platforms so you can share music with people, regardless of streaming platform.\n\nto get started, just send a Spotify, Apple Music, or SoundCloud link. do `/` to view all of my commands (they're slash commands now!)"
    );

  const systemChannel = (await guild.systemChannel) as TextChannel;
  const guildOwner = await guild.client.users.fetch(await guild.ownerId);

  if (systemChannel) {
    await systemChannel.send({embeds: [guideEmbed]}).catch();
  } else if (guildOwner) {
    await guildOwner.send({embeds: [guideEmbed]}).catch();
  } else {
    return;
  }
}

export async function guildDelete(guild: Guild): Promise<void> {
  const guilds = guild.client.guilds.cache.size;
  const newChannel = (await guild.client.channels.fetch("840785989898469397")) as TextChannel;

  const embed = new MessageEmbed()
    .setColor(Colors.RED)
    .setDescription(
      `<:leave:822184878119845888> Left Discord ${guild.name} (ID: \`${guild.id}\`) with ${guild.memberCount} members.`
    )
    .setFooter(`Total guilds: ${guilds}`);

  await newChannel.send({embeds: [embed]});
}

export async function startupMessage(client: Client): Promise<void> {
  const newChannel = (await client.channels.fetch("840785989898469397")) as TextChannel;

  const embed = new MessageEmbed()
    .setColor(Colors.BLUE)
    .setDescription(`:up: Bot has been booted up.`);

  await newChannel.send({embeds: [embed]});
}

export async function newVote(client: Client, user: User | string): Promise<void> {
  const embed = new MessageEmbed().setColor(Colors.BLUE);
  const newChannel = (await client.channels.fetch("840785989898469397")) as TextChannel;

  if (typeof user === "string") {
    const fetchedUser = await client.users.fetch(user);
    embed.setDescription(
      `:arrow_up: \`${fetchedUser.tag}\` (\`${fetchedUser.id}\`) upvoted us on Top.gg!`
    );
  } else {
    embed.setDescription(`:arrow_up: \`${user.tag}\` (ID: \`${user.id}\`) upvoted us on Top.gg!`);
  }

  await newChannel.send({embeds: [embed]});
}
