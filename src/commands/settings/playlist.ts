import {
  CommandInteraction,
  Constants,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  Permissions,
  User,
} from "discord.js";
import { botAdmins } from "../../inhibitors/botAdmins";
import { JoshAPI } from "../../services/api/josh";
import { prisma } from "../../services/prisma";
import { InteractionOptions } from "../../services/util/interactionOptions";
import { StandardEmbed } from "../../structs/standard-embed";
import { ChatCommand } from "../../types/command";
import { PLATFORM_EMOJI } from "../../services/reply-song";
import { platforms } from "../../services/events/interaction";

export const playlist: ChatCommand = {
  name: "playlist",
  description: "Tunes.ninja playlist API.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "sync",
      description:
        "Sync Spotify songs sent in this channel to your server's playlist.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "platform",
          description: "Platform to create the playlist on.",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "Spotify",
              value: "spotify",
            },
            {
              name: "Apple Music",
              value: "apple-music",
            },
          ],
        },
      ],
    },
    {
      name: "unsync",
      description: "Unsync this channel from the playlist.",
      type: "SUB_COMMAND",
    },
    {
      name: "view",
      description:
        "View playlists synced to this channel and get links to them.",
      type: "SUB_COMMAND",
    },
  ],
  inhibitors: [],
  async run(interaction) {
    await interaction.deferReply();

    const options = new InteractionOptions(
      interaction.options.data as unknown as InteractionOptions[]
    );

    if (options.subCommandName === "sync") {
      const linked = await JoshAPI.getLinkedPlaylists(interaction.channel!.id);

      const member = interaction.member as GuildMember;

      const canManageServer = member.permissions.has(
        Permissions.FLAGS.MANAGE_GUILD
      );

      if (!canManageServer) {
        throw new Error("You do not have permission to use this command.");
      }

      const user = await JoshAPI.getUser(interaction.user.id);

      let playlist: any;
      let platform: string;

      if (!user.services.spotify && !user.services.appleMusic) {
        throw new Error("No services are linked! Do `/api link` to link them.");
      }

      // TODO: this needs to be written to be way cleaner
      if (user.services.spotify && !user.services.appleMusic) {
        playlist = await JoshAPI.createPlaylist(interaction.user, "spotify");
        platform = "spotify";
      } else if (user.services.appleMusic && !user.services.spotify) {
        playlist = await JoshAPI.createPlaylist(
          interaction.user,
          "apple-music"
        );
        platform = "apple-music";
      } else if (user.services.appleMusic && user.services.spotify) {
        const spotifyButton = new MessageButton()
          .setCustomId("button_spotify_playlistSelect")
          .setLabel("Spotify")
          .setStyle("SECONDARY")
          .setEmoji(PLATFORM_EMOJI["spotify"]);

        const appleMusicButton = new MessageButton()
          .setCustomId("button_apple-music_playlistSelect")
          .setLabel("Apple Music")
          .setStyle("SECONDARY")
          .setEmoji(PLATFORM_EMOJI["apple_music"]);

        const row = new MessageActionRow().addComponents([
          spotifyButton,
          appleMusicButton,
        ]);

        const msg = await interaction.editReply({
          content:
            "You have multiple platforms linked - which would you like to create the playlist on?",
          components: [row],
        });

        const filter = (i: any) => {
          return i.user.id === interaction.user.id;
        };

        await (msg as Message)
          .awaitMessageComponent({
            filter,
            componentType: "BUTTON",
            time: 10000,
          })
          .then(async (interaction) => {
            playlist = await JoshAPI.createPlaylist(
              interaction.user,
              interaction.customId.split("_")[1]
            );
            platform = interaction.customId.split("_")[1];
            await interaction.deferUpdate();
          })
          .catch(async () => {
            await interaction.deleteReply();
          });
      }

      if (!playlist)
        throw new Error("Internal error, please report this using `/support`.");

      if (playlist.status) {
        await prisma.joshChannel.create({
          data: {
            id: interaction.channel!.id,
            platform: platform!, // TODO: remove this !
            playlistID: playlist.detail.playlistID,
          },
        });

        await JoshAPI.syncPlaylist(
          interaction.guild!.id,
          interaction.channel!.id,
          interaction.user!.id,
          platform!, // TODO: remove this !
          playlist.detail.playlistID
        );

        const embed = new StandardEmbed(interaction.user as User)
          .setDescription(
            `All links in this channel will now be added to your shared playlist! Open the playlist by clicking the button below.`
          )
          .setColor(Constants.Colors.GREEN);

        const row = new MessageActionRow();
        row.addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setURL(
              `${
                platform! === "apple-music"
                  ? `https://music.apple.com/playlist/${playlist.detail.playlistID}`
                  : `https://open.spotify.com/playlist/${playlist.detail.playlistID}`
              }`
            )
            .setLabel("Open Playlist")
            .setEmoji(PLATFORM_EMOJI[platform!]) // TODO: remove this !
        );
        await interaction.editReply({
          embeds: [embed],
          components: [row],
          content: null,
        });
      }
    } else if (options.subCommandName === "unsync") {
      // TODO: probably need to write all of this innit
      const member = interaction.member as GuildMember;

      const canManageServer = member.permissions.has(
        Permissions.FLAGS.MANAGE_GUILD
      );

      if (!canManageServer) {
        throw new Error("You do not have permission to use this command.");
      }

      const synced = await JoshAPI.getLinkedPlaylists(interaction.channel!.id);

      if (
        !synced.playlists.spotify.length &&
        !synced.playlists.appleMusic.length
      ) {
        throw new Error(
          "No synced playlists found! Do `/playlist sync` to start."
        );
      }

      const menu = new MessageSelectMenu()
        .setCustomId(`select_${interaction.user.id}_unsync`)
        .setPlaceholder(`Select a playlist from the list`);

      for (const service in synced.playlists) {
        synced.playlists[service].map(
          (p: {
            playlistTitle: string;
            playlistLinkedPlatformUniqueID: string;
          }) => {
            return menu.addOptions({
              label: `${p.playlistTitle}`,
              value: `${service}_${p.playlistLinkedPlatformUniqueID}`,
              description: `ID: ${p.playlistLinkedPlatformUniqueID}`,
              emoji: PLATFORM_EMOJI[service],
            });
          }
        );
      }

      const row = new MessageActionRow().addComponents(menu);

      const msg = await interaction.editReply({
        content: "Select a playlist to unsync from this channel.",
        components: [row],
      });

      const filter = (i: any) => {
        return i.user.id === interaction.user.id;
      };

      await (msg as Message)
        .awaitMessageComponent({
          filter,
          componentType: "SELECT_MENU",
          time: 10000,
        })
        .then(async (interaction) => {
          await interaction.deferUpdate();
          const platform = interaction.values[0].split("_")[0];
          const id = interaction.values[0].split("_")[1];

          const response = await JoshAPI.unsyncPlaylist(
            interaction.channel!.id,
            platforms[platform]
          );

          if (response.status) {
            await interaction.editReply({
              content: "Your playlist has been unlinked!",
              components: [],
            });
          }
          await prisma.joshChannel.delete({
            where: {
              playlistID: id,
            },
          });
        })
        .catch(async (e) => {
          await interaction.deleteReply();
        });
    } else if (options.subCommandName === "view") {
      const member = interaction.member as GuildMember;

      const synced = await JoshAPI.getLinkedPlaylists(interaction.channel!.id);

      if (
        !synced.playlists.spotify.length &&
        !synced.playlists.appleMusic.length
      ) {
        throw new Error(
          "No synced playlists found! Do `/playlist sync` to start."
        );
      }

      const menu = new MessageSelectMenu()
        .setCustomId(`select_${interaction.user.id}_unsync`)
        .setPlaceholder(`Select a playlist from the list`);

      for (const service in synced.playlists) {
        synced.playlists[service].map(
          (p: {
            playlistTitle: string;
            playlistLinkedPlatformUniqueID: string;
          }) => {
            return menu.addOptions({
              label: `${p.playlistTitle}`,
              value: `${service}_${p.playlistLinkedPlatformUniqueID}`,
              description: `ID: ${p.playlistLinkedPlatformUniqueID}`,
              emoji: PLATFORM_EMOJI[service],
            });
          }
        );
      }

      const row = new MessageActionRow().addComponents(menu);

      const msg = await interaction.editReply({
        content: "Select a playlist.",
        components: [row],
      });

      const filter = (i: any) => {
        return i.user.id === interaction.user.id;
      };

      await (msg as Message)
        .awaitMessageComponent({
          filter,
          componentType: "SELECT_MENU",
          time: 10000,
        })
        .then(async (interaction) => {
          await interaction.deferUpdate();
          const platform = interaction.values[0].split("_")[0];
          const id = interaction.values[0].split("_")[1];

          await interaction.editReply({
            content: `${
              platform! === "apple-music"
                ? `https://music.apple.com/playlist/${id}`
                : `https://open.spotify.com/playlist/${id}`
            }`,
            components: [],
          });
        })
        .catch(async (e) => {
          await interaction.deleteReply();
        });
    }
  },
};
