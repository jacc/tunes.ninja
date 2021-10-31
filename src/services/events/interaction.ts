import {
  AutocompleteInteraction,
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  DiscordAPIError,
  GuildMember,
  Interaction,
  SelectMenuInteraction,
} from "discord.js";
import {
  chatCommandsMap,
  messageCommandsMap,
  userCommandsMap,
} from "../../commands";
import { StandardEmbed } from "../../structs/standard-embed";
import { DataDog } from "../api/datadog";
import { JoshAPI } from "../api/josh";
import * as Sentry from "@sentry/node";
import {SpotifyAPI} from "../api/spotify";

const dd = new DataDog();

export async function handleInteraction(
  interaction: Interaction
): Promise<void> {
  if (interaction.isContextMenu())
    return await handleContextInteraction(interaction);
  if (interaction.isCommand())
    return await handleMessageInteraction(interaction);
  if (interaction.isSelectMenu())
    return await handleSelectInteraction(interaction);
  if (interaction.isButton()) return await handleButtonInteraction(interaction);
  if (interaction.isAutocomplete()) return await handleAutocompleteInteraction(interaction)
}

export async function handleContextInteraction(
  interaction: ContextMenuInteraction
): Promise<void> {
  await dd.inc(`interactions.ContextMenuInteraction.run`);
  let command;

  switch (interaction.targetType) {
    case "USER":
      command = userCommandsMap.get(interaction.commandName);
      break;
    case "MESSAGE":
      command = messageCommandsMap.get(interaction.commandName);
      break;
  }

  if (!command) return;

  const inhibitors = Array.isArray(command.inhibitors)
    ? command.inhibitors
    : [command.inhibitors];

  try {
    for (const inhibitor of inhibitors) {
      await inhibitor(interaction);
    }

    await command.run(interaction);
  } catch (e: any) {
    Sentry.captureException(e);
    switch (true) {
      case e instanceof DiscordAPIError:
        break;
      default:
        try {
          if (!interaction.deferred) {
            await interaction.reply({
              ephemeral: true,
              embeds: [
                new StandardEmbed(
                  interaction.member as GuildMember
                ).setDescription(`⚠ ${e.message}`),
              ],
            });
          } else {
            await interaction.editReply({
              embeds: [
                new StandardEmbed(
                  interaction.member as GuildMember
                ).setDescription(`⚠ ${e.message}`),
              ],
            });
          }
        } catch (error) {
          console.log(error);
          console.log("just give up");
        }
    }
  }
}

export async function handleMessageInteraction(
  interaction: CommandInteraction
): Promise<void> {
  try {
    await dd.inc(`interactions.CommandInteraction.run`);
    const command = chatCommandsMap.get(interaction.commandName);

    if (!command) return;

    const inhibitors = Array.isArray(command.inhibitors)
      ? command.inhibitors
      : [command.inhibitors];

    try {
      for (const inhibitor of inhibitors) {
        await inhibitor(interaction);
      }
      await command.run(interaction);
    } catch (e: any) {
      switch (true) {
        case e instanceof DiscordAPIError:
          break;
        default:
          try {
            if (!interaction.deferred) {
              await interaction.reply({
                ephemeral: true,
                embeds: [
                  new StandardEmbed(
                    interaction.member as GuildMember
                  ).setDescription(`⚠ ${e.message}`),
                ],
              });
            } else {
              await interaction.editReply({
                embeds: [
                  new StandardEmbed(
                    interaction.member as GuildMember
                  ).setDescription(`⚠ ${e.message}`),
                ],
              });
            }
          } catch (error) {
            console.log("just give up");
          }
      }
    }
  } catch (e: any) {
    Sentry.captureException(e);
  }
}

export async function handleSelectInteraction(
  interaction: SelectMenuInteraction
): Promise<void> {
  if (interaction.customId.includes("unsync")) return;
  try {
    await interaction.deferUpdate();
    await dd.inc(`interactions.SelectMenuInteraction.run`);
    const userId = interaction.customId.split("select_")[1].split("_")[0];
    const platform = interaction.customId.split("select_")[1].split("_")[1];
    const playlistId = interaction.values[0].split("_")[1];
    // console.log(interaction.values[0])
    const songId = interaction.values[0].split("_")[2].split("&")[0];
    const request = await JoshAPI.addSongToPlaylist(
      userId,
      playlistId,
      songId,
      platforms[platform]
    );
    if (request.status === true) {
      await interaction.editReply({
        embeds: [
          new StandardEmbed(interaction.member as GuildMember).setDescription(
            `<:check:875543430464430081> Added the song to your playlist!`
          ),
        ],
        components: [],
      });
    }
  } catch (e: any) {
    Sentry.captureException(e);
  }
}

export async function handleButtonInteraction(
  interaction: ButtonInteraction
): Promise<void> {
  if (interaction.customId.includes("playlistSelect")) return;
  try {
    await interaction.deferUpdate();
    dd.inc(`interactions.ButtonInteraction.run`);
    const platform = interaction.customId.split("_")[1];
    const action = interaction.customId.split("_")[2];

    if (action === "link") {
      const request = await JoshAPI.linkUser(
        interaction.guild!.id,
        interaction.channel!.id,
        interaction.user!.id,
        platform
      );

      await interaction.editReply({
        components: [],
        content: `[Click here to link your ${platform
          .split("-")
          .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(" ")} account to tunes.ninja!](${request})`,
      });
    } else if (action === "unlink") {
      console.log(platforms[platform]);
      const request = await JoshAPI.unlinkUser(
        interaction.user!.id,
        platforms[platform]
      );
      console.log(request);
      await interaction.editReply({
        components: [],
        content: request
          ? `Unlinked your ${platform
              .split("-")
              .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
              .join(" ")} account!`
          : "Couldn't unlink.",
      });
    }
  } catch (e: any) {
    Sentry.captureException(e);
  }
}

export async function handleAutocompleteInteraction(interaction: AutocompleteInteraction): Promise<void> {
  if (interaction.commandName === "song") return handleSongAutocomplete(interaction)
  if (interaction.commandName === "album") return handleAlbumAutocomplete(interaction)
  if (interaction.commandName === "artist") return handleArtistAutocomplete(interaction)


  async function handleSongAutocomplete(interaction: AutocompleteInteraction) : Promise<void> {
    const query = interaction.options.get("song")
    if (!query?.value) {
      const songs = await SpotifyAPI.topSongs()
      await interaction.respond([
        {
          name: "Start typing to search a song on Spotify",
          value: ''
        },
        ...songs.items.slice(0, 24).map((song: any) => ({ name: `${song.track.name} by ${song.track.artists[0].name}`, value: `${song.track.uri}` }))
      ])
    } else {
      const songs = await SpotifyAPI.searchSongs(query.value as string)
      await interaction.respond([
        ...songs.items.slice(0, 25).map((song: any) => ({ name: `${song.name} by ${song.artists[0].name}`, value: `${song.uri}` }))
      ])
    }
  }
  async function handleAlbumAutocomplete(interaction: AutocompleteInteraction) : Promise<void> {
    const query = interaction.options.get("query")
    if (!query?.value) {
      const songs = await SpotifyAPI.topSongs()
      await interaction.respond([
        {
          name: "Start typing to search a album on Spotify",
          value: ''
        },
        ...songs.items.slice(0, 24).map((song: any) => ({ name: `${song.track.album.name} by ${song.track.album.artists[0].name}`, value: `${song.track.album.uri}` }))
      ])
    } else {
      const songs = await SpotifyAPI.searchAlbums(query.value as string)
      await interaction.respond([
        ...songs.items.slice(0, 25).map((song: any) => ({ name: `${song.name} by ${song.artists[0].name}`, value: `${song.uri}` }))
      ])
    }
  }
  async function handleArtistAutocomplete(interaction: AutocompleteInteraction) : Promise<void> {
    const query = interaction.options.get("query")
    if (!query?.value) {
      const songs = await SpotifyAPI.topSongs()
      await interaction.respond([
        {
          name: "Start typing to search an artist on Spotify",
          value: ''
        },
        ...songs.items.slice(0, 24).map((song: any) => ({ name: `${song.track.artists[0].name}`, value: `${song.track.artists[0].name}` }))
      ])
    } else {
      const songs = await SpotifyAPI.searchArtists(query.value as string)
      await interaction.respond([
        ...songs.items.slice(0, 25).map((song: any) => ({ name: `${song.name}`, value: `${song.name}` }))
      ])
    }
  }
}


export const platforms: Record<string, string> = {
  "apple-music": "appleMusic",
  spotify: "spotify",
  appleMusic: "apple-music",
};
