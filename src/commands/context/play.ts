import { MessageCommand } from "../../types/command";
import { JoshAPI } from "../../services/api/josh";
import { MessageEmbed } from "discord.js";
import { SongsApi } from "../../services/api/song";
import * as z from "zod";
import { voted } from "../../inhibitors/voted";

const linkSchema = z.string().refine((x) => {
  return (
    x.includes("open.spotify.com/track") ||
    x.includes("open.spotify.com/album") ||
    x.includes("music.apple.com") ||
    x.includes("soundcloud.com")
  );
}, "");

export const playOnSpotify: MessageCommand = {
  name: "Play on Spotify",
  inhibitors: [voted],
  type: "MESSAGE",
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let url;
    if (
      interaction.options.get("message")!.message!.author.id ===
        "840585628408217610" &&
      interaction.options.get("message")!.message!.components
    ) {
      const button =
        interaction.options.get("message")!.message!.components![0]
          .components[0];
      if (button.type !== "BUTTON") return; // Do something, not a button
      if (button.style !== "LINK") return; // Do something, not a link button
      url = linkSchema.safeParse(button.url);
    } else {
      url = linkSchema.safeParse(
        interaction.options.get("message")!.message!.content
      );
    }

    if (!url.success) {
      throw new Error(
        "I couldn't find a valid song link in this message - check and try again."
      );
    }

    const song = await SongsApi.getLinks(url.data);
    const songId = song.links!.spotify!.split(
      "https://open.spotify.com/track/"
    )[1];

    await JoshAPI.playOnSpotify(interaction.user!.id, songId);

    const embed = new MessageEmbed()
      .setAuthor(
        `Now playing ${song.title} by ${song.artist} on Spotify`,
        song.thumbnail ? song.thumbnail : ""
      )
      .setColor(0x212121);

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
