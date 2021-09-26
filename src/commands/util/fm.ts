import { ChatCommand } from "../../types/command";
import { returnLinks } from "../../services/reply-song";
import { SpotifyAPI } from "../../services/api/spotify";
import { LastFMAPI } from "../../services/api/lastfm";
import { prisma } from "../../services/prisma";
import { NoProfile } from "../../structs/exceptions";
import { voted } from "../../inhibitors/voted";

export const fm: ChatCommand = {
  name: "fm",
  description: "Search for song based on your Last.fm activity.",
  inhibitors: [voted],
  type: "CHAT_INPUT",

  async run(interaction) {
    const userSettings = await prisma.user.findFirst({
      where: { id: interaction.member?.user.id },
    });

    if (!userSettings || !userSettings.lastfm) {
      throw new NoProfile();
    }

    const lastfm = await LastFMAPI.search(userSettings.lastfm);
    const song = await SpotifyAPI.searchSong(`${lastfm.song} ${lastfm.artist}`);
    await returnLinks(interaction, song);
  },
};
