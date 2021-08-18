import { MessageCommand } from "../../types/command";
import { JoshAPI } from "../../services/api/josh";
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import { SongsApi } from "../../services/api/song";
import * as z from "zod";
import { voted } from "../../inhibitors/voted";
import {platforms} from "../../services/events/interaction";
import {PLATFORM_EMOJI} from "../../services/reply-song";

const linkSchema = z.string().refine((x) => {
  return (
    x.includes("open.spotify.com/track") ||
    x.includes("open.spotify.com/album") ||
    x.includes("music.apple.com") ||
    x.includes("soundcloud.com")
  );
}, "");

export const playlists: MessageCommand = {
  name: "Add to Playlist",
  inhibitors: [voted],
  type: "MESSAGE",
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const url = linkSchema.safeParse(
      interaction.options.get("message")!.message!.content
    );

    if (!url.success) {
      throw new Error(
        "I couldn't find a valid song link in this message - check and try again."
      );
    }

    const song = await SongsApi.getLinks(url.data);

    console.log(song)

    const user = await JoshAPI.user(interaction.user.id)

    console.log(user)

    if (!user.services.appleMusic && !user.services.spotify) {
      throw new Error("You don't have any music services linked! Do `/api link` to get started!")
    }

    const rows = []

    for (const platform in user.services) {
      if (user.services[platform]) {
        console.log(platforms[platform])
        const playlists = await JoshAPI.getPlaylists(interaction.user.id, platforms[platform]
        );

        console.log(platform)

        let songID: string;

        switch (platform) {
          case "spotify":
            songID = song.links!.spotify!.split("https://open.spotify.com/track/")[1]
            break
          case "appleMusic":
            songID = song.links!.apple_music!.split("?")[0]
        }

        const row = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId(`select_${interaction.user.id}`)
            .setPlaceholder("Select a playlist from the list")
            .addOptions(
              playlists.playlists.map(
                (p: { playlist_display_name: string; playlist_id: string }) => {
                  return {
                    label: p.playlist_display_name,
                    value: `_${p.playlist_id}_${songID}`,
                    emoji: PLATFORM_EMOJI[platform]
                  };
                }
              )
            )
        );

        rows.push(row)
      }
    }


    const embed = new MessageEmbed()
      .setAuthor(
        `${song.title} by ${song.artist}`,
        song.thumbnail ? song.thumbnail : ""
      )
      .setColor(0x212121)
      .setDescription(
        "Add this song to your playlist by selecting one in the dropdown."
      )
      .setFooter("Playlist not showing? Discord only has 25 select options");

    await interaction.editReply({
      embeds: [embed],
      components: rows,
    });
  },
};
